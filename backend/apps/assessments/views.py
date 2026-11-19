from rest_framework import views, permissions, status, generics
from rest_framework.response import Response
from .models import AssessmentCategory, Assessment, Question, AssessmentAttempt, AssessmentResponse
from .serializers import (
    AssessmentCategorySerializer,
    AssessmentListSerializer,
    AssessmentTakeSerializer,
    AssessmentSubmitSerializer,
    AssessmentAttemptDetailSerializer
)
from .code_sandbox import execute_code
from notifications.models import Notification
from accounts.permissions import IsCandidate

class AssessmentCategoryListView(generics.ListAPIView):
    queryset = AssessmentCategory.objects.all().order_by('name')
    serializer_class = AssessmentCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

class AssessmentListView(generics.ListAPIView):
    serializer_class = AssessmentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        category_slug = self.request.query_params.get('category')
        qs = Assessment.objects.filter(is_active=True).select_related('category').prefetch_related('questions')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        return qs

class AssessmentDetailView(generics.RetrieveAPIView):
    queryset = Assessment.objects.filter(is_active=True)
    serializer_class = AssessmentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

class AssessmentTakeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        try:
            assessment = Assessment.objects.prefetch_related('questions').get(id=id, is_active=True)
            return Response(AssessmentTakeSerializer(assessment).data)
        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found."}, status=status.HTTP_404_NOT_FOUND)

class AssessmentRunCodeView(views.APIView):
    """
    Live Code Execution Endpoint:
    Executes candidate code in an isolated sandbox (Python, JavaScript, SQL).
    - action='run': runs against visible sample test cases only. Does not complete question.
    - action='submit': evaluates against full test suite (sample + hidden), masks hidden tests,
      and marks question completed if criteria met.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_code = request.data.get('code', '')
        question_id = request.data.get('question_id')
        test_cases = request.data.get('test_cases', [])
        req_lang = request.data.get('language')
        action = request.data.get('action', 'run')

        question = None
        if question_id:
            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                pass

        language = (req_lang or (question.language if question else None) or 'python').lower().strip()
        if language == 'java':
            function_name = (question.function_name_java if question and question.function_name_java else None) or (question.function_name if question else None) or request.data.get('function_name') or 'solution'
        else:
            function_name = (question.function_name if question else None) or request.data.get('function_name') or 'solution'

        if not user_code or not user_code.strip():
            return Response({"error": "No code provided to execute."}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'submit':
            eval_tests = (question.test_cases if question else None) or test_cases or (question.sample_test_cases if question else None) or []
            execution_result = execute_code(
                language=language,
                user_code=user_code,
                test_cases=eval_tests,
                function_name=function_name
            )
            sample_count = len(question.sample_test_cases) if question and question.sample_test_cases else 0
            sanitized_tests = []
            for idx, t in enumerate(execution_result.get('tests', [])):
                if idx < sample_count:
                    sanitized_tests.append(t)
                else:
                    sanitized_tests.append({
                        "input": f"Hidden test case #{idx + 1}",
                        "expected": "[Hidden]",
                        "actual": "[Hidden]" if t.get('passed') else (t.get('error') or "Failed"),
                        "passed": t.get('passed', False),
                        "hidden": True
                    })
            execution_result['tests'] = sanitized_tests
            execution_result['action'] = 'submit'
            execution_result['completed'] = execution_result.get('all_passed', False)
        else:
            sample_tests = (question.sample_test_cases if question else None) or test_cases or []
            execution_result = execute_code(
                language=language,
                user_code=user_code,
                test_cases=sample_tests,
                function_name=function_name
            )
            execution_result['action'] = 'run'
            execution_result['completed'] = False

        return Response(execution_result, status=status.HTTP_200_OK)

class AssessmentSubmitView(views.APIView):
    """
    Evaluates both MCQs (50 pts max) and Code Challenges (50 pts max) with genuine sandbox execution.
    Calculates final score out of 100 with detailed breakdown.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AssessmentSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        assessment_id = serializer.validated_data['assessment_id']
        answers = serializer.validated_data.get('answers', {})
        code_answers = serializer.validated_data.get('code_answers', {})

        try:
            assessment = Assessment.objects.prefetch_related('questions').get(id=assessment_id, is_active=True)
        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found."}, status=status.HTTP_404_NOT_FOUND)

        questions = assessment.questions.all().order_by('order', 'id')
        total_questions = questions.count()
        if total_questions == 0:
            return Response({"error": "No questions configured for this assessment."}, status=status.HTTP_400_BAD_REQUEST)

        mcq_questions = [q for q in questions if q.question_type == Question.QuestionType.MCQ]
        code_questions = [q for q in questions if q.question_type == Question.QuestionType.CODE]

        total_mcqs = len(mcq_questions)
        total_coding = len(code_questions)

        mcq_earned = 0.0
        coding_earned = 0.0
        correct_mcqs = 0
        correct_coding = 0
        responses_to_create = []

        # Standard 10 marks per question
        POINTS_PER_QUESTION = 10.0

        for q in questions:
            q_id_str = str(q.id)
            if q.question_type == Question.QuestionType.CODE:
                # Real code execution against evaluation test cases
                user_entry = code_answers.get(q_id_str, '')
                if isinstance(user_entry, dict):
                    user_code = user_entry.get('code', '').strip()
                    user_lang = (user_entry.get('language') or q.language or 'python').lower().strip()
                else:
                    user_code = str(user_entry).strip()
                    user_lang = (q.language or 'python').lower().strip()

                if user_lang == 'java':
                    fn_name = (q.function_name_java or q.function_name or 'solution')
                else:
                    fn_name = (q.function_name or 'solution')

                test_res = {}
                is_correct = False
                eval_tests = q.test_cases or q.sample_test_cases or []

                if user_code and eval_tests:
                    test_res = execute_code(
                        language=user_lang,
                        user_code=user_code,
                        test_cases=eval_tests,
                        function_name=fn_name
                    )
                    is_correct = test_res.get('all_passed', False)

                    # Compute score based on test cases passed
                    t_list = test_res.get('tests', [])
                    if t_list:
                        passed_t = sum(1 for t in t_list if t.get('passed', False))
                        coding_earned += (passed_t / len(t_list)) * POINTS_PER_QUESTION
                    elif is_correct:
                        coding_earned += POINTS_PER_QUESTION
                elif is_correct:
                    coding_earned += POINTS_PER_QUESTION

                if is_correct:
                    correct_coding += 1

                responses_to_create.append({
                    "question": q,
                    "selected": None,
                    "code_answer": user_code,
                    "test_results": test_res,
                    "is_correct": is_correct
                })

            else:
                # MCQ evaluation
                user_choice = answers.get(q_id_str)
                is_correct = False
                if user_choice is not None and str(user_choice).isdigit():
                    is_correct = (int(user_choice) == q.correct_option_index)

                if is_correct:
                    correct_mcqs += 1
                    mcq_earned += POINTS_PER_QUESTION

                responses_to_create.append({
                    "question": q,
                    "selected": int(user_choice) if (user_choice is not None and str(user_choice).isdigit()) else None,
                    "code_answer": "",
                    "test_results": {},
                    "is_correct": is_correct
                })

        total_correct = correct_mcqs + correct_coding
        final_score = int(round(mcq_earned + coding_earned))
        max_possible = max(10, total_questions * 10)
        percentage = min(100, int(round((final_score / max_possible) * 100)))
        passed = (percentage >= assessment.passing_score)

        attempt = AssessmentAttempt.objects.create(
            candidate=request.user,
            assessment=assessment,
            score=final_score,
            percentage=percentage,
            passed=passed,
            total_questions=total_questions,
            correct_answers=total_correct,
            mcq_score=int(round(mcq_earned)),
            coding_score=int(round(coding_earned)),
            total_mcqs=total_mcqs,
            total_coding=total_coding
        )

        for item in responses_to_create:
            AssessmentResponse.objects.create(
                attempt=attempt,
                question=item['question'],
                selected_option_index=item['selected'],
                code_answer=item.get('code_answer', ''),
                test_results=item.get('test_results', {}),
                is_correct=item['is_correct']
            )

        # In-app notification
        status_text = "Passed" if passed else "Completed"
        Notification.objects.create(
            recipient=request.user,
            title=f"Assessment Result: {assessment.title}",
            message=f"You scored {percentage}/100 ({status_text}) on '{assessment.title}'. MCQs: {correct_mcqs}/{total_mcqs}, Coding: {correct_coding}/{total_coding} passed.",
            notification_type=Notification.NotificationType.ASSESSMENT_RESULT,
            link=f"/assessments/results/{attempt.id}"
        )

        return Response(AssessmentAttemptDetailSerializer(attempt).data, status=status.HTTP_201_CREATED)

class CandidateAssessmentAttemptsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        attempts = AssessmentAttempt.objects.filter(
            candidate=request.user
        ).select_related('assessment', 'assessment__category').order_by('-completed_at')
        return Response(AssessmentAttemptDetailSerializer(attempts, many=True).data)

class CandidateAttemptDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request, pk):
        try:
            attempt = AssessmentAttempt.objects.select_related(
                'assessment', 'assessment__category'
            ).prefetch_related(
                'responses', 'responses__question', 'assessment__questions'
            ).get(pk=pk, candidate=request.user)
            return Response(AssessmentAttemptDetailSerializer(attempt).data)
        except AssessmentAttempt.DoesNotExist:
            return Response({"error": "Assessment attempt not found."}, status=status.HTTP_404_NOT_FOUND)
