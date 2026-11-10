from rest_framework import serializers
from .models import AssessmentCategory, Assessment, Question, AssessmentAttempt, AssessmentResponse

class AssessmentCategorySerializer(serializers.ModelSerializer):
    assessment_count = serializers.IntegerField(source='assessments.count', read_only=True)

    class Meta:
        model = AssessmentCategory
        fields = ['id', 'name', 'slug', 'description', 'icon_name', 'assessment_count']

class AssessmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    question_count = serializers.IntegerField(read_only=True)
    user_best_score = serializers.SerializerMethodField()

    class Meta:
        model = Assessment
        fields = [
            'id', 'category', 'category_name', 'title', 'slug', 
            'description', 'duration_minutes', 'passing_score', 
            'difficulty', 'question_count', 'user_best_score', 'created_at'
        ]

    def get_user_best_score(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            best_attempt = AssessmentAttempt.objects.filter(
                candidate=request.user, assessment=obj
            ).order_by('-percentage').first()
            if best_attempt:
                return {
                    "percentage": best_attempt.percentage,
                    "passed": best_attempt.passed,
                    "date": best_attempt.completed_at
                }
        return None

class QuestionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'difficulty', 'question_text', 'question_type',
            'input_format', 'output_format', 'constraints', 'examples',
            'language', 'options', 'order', 'starter_code',
            'sample_test_cases', 'function_name'
        ]

class AssessmentTakeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    questions = QuestionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = [
            'id', 'category', 'category_name', 'title', 'slug',
            'description', 'duration_minutes', 'passing_score',
            'difficulty', 'questions'
        ]

class AssessmentSubmitSerializer(serializers.Serializer):
    assessment_id = serializers.IntegerField()
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True), required=False, default=dict)
    code_answers = serializers.DictField(child=serializers.CharField(allow_blank=True), required=False, default=dict)

class QuestionDetailResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'difficulty', 'question_text', 'question_type',
            'input_format', 'output_format', 'constraints', 'examples',
            'language', 'options', 'correct_option_index', 'explanation',
            'starter_code', 'sample_test_cases', 'test_cases', 'function_name'
        ]

class AssessmentResponseDetailSerializer(serializers.ModelSerializer):
    question = QuestionDetailResultSerializer(read_only=True)

    class Meta:
        model = AssessmentResponse
        fields = ['id', 'question', 'selected_option_index', 'code_answer', 'test_results', 'is_correct']

class AssessmentAttemptDetailSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(source='assessment.title', read_only=True)
    category_name = serializers.CharField(source='assessment.category.name', read_only=True)
    passing_score = serializers.IntegerField(source='assessment.passing_score', read_only=True)
    responses = AssessmentResponseDetailSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentAttempt
        fields = [
            'id', 'assessment', 'assessment_title', 'category_name', 'passing_score',
            'score', 'percentage', 'passed', 'total_questions', 'correct_answers',
            'mcq_score', 'coding_score', 'total_mcqs', 'total_coding',
            'completed_at', 'responses'
        ]
