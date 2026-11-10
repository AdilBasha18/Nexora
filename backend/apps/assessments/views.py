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
from .code_sandbox import execute_python_code
from notifications.models import Notification
from accounts.permissions import IsCandidate

class AssessmentCategoryListView(generics.ListAPIView):
    queryset = AssessmentCategory.objects.all().order_by('name')
    serializer_class = AssessmentCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class AssessmentListView(generics.ListAPIView):
    serializer_class = AssessmentListSerializer
    permission_classes = [permissions.AllowAny]
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
    permission_classes = [permissions.AllowAny]
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
    Executes candidate code in an isolated Python sandbox against test cases.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_code = request.data.get('code', '')
        question_id = request.data.get('question_id')
        test_cases = request.data.get('test_cases', [])
        function_name = request.data.get('function_name', 'solution')

        if question_id:
            try:
                question = Question.objects.get(id=question_id)
                test_cases = question.test_cases or test_cases
                function_name = question.function_name or function_name
            except Question.DoesNotExist:
                pass

        if not user_code or not user_code.strip():
            return Response({"error": "No code provided to execute."}, status=status.HTTP_400_BAD_REQUEST)

        execution_result = execute_python_code(
            user_code=user_code,
            test_cases=test_cases,
            function_name=function_name
        )

        return Response(execution_result, status=status.HTTP_200_OK)

class AssessmentSubmitView(views.APIView):
    """
    Evaluates both MCQs and Code Challenges with genuine sandbox execution.
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

        questions = assessment.questions.all()
        total_questions = questions.count()
        if total_questions == 0:
            return Response({"error": "No questions configured for this assessment."}, status=status.HTTP_400_BAD_REQUEST)

        correct_count = 0
        responses_to_create = []

        for q in questions:
            q_id_str = str(q.id)
            if q.question_type == Question.QuestionType.CODE:
                # Real code execution against test cases
                user_code = code_answers.get(q_id_str, '').strip()
                test_res = {}
                is_correct = False
                if user_code and q.test_cases:
                    test_res = execute_python_code(
                        user_code=user_code,
                        test_cases=q.test_cases,
                        function_name=q.function_name
                    )
                    is_correct = test_res.get('all_passed', False)

                if is_correct:
                    correct_count += 1

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
                    correct_count += 1

                responses_to_create.append({
                    "question": q,
                    "selected": int(user_choice) if (user_choice is not None and str(user_choice).isdigit()) else None,
                    "code_answer": "",
                    "test_results": {},
                    "is_correct": is_correct
                })

        percentage = int((correct_count / total_questions) * 100)
        passed = (percentage >= assessment.passing_score)

        attempt = AssessmentAttempt.objects.create(
            candidate=request.user,
            assessment=assessment,
            score=correct_count,
            percentage=percentage,
            passed=passed,
            total_questions=total_questions,
            correct_answers=correct_count
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

        # Send in-app notification
        status_text = "Passed" if passed else "Completed"
        Notification.objects.create(
            recipient=request.user,
            title=f"Assessment Result: {assessment.title}",
            message=f"You scored {percentage}% ({status_text}) on '{assessment.title}'.",
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
