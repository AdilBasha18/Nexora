from django.db import models
from django.conf import settings
from django.utils.text import slugify

class AssessmentCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='Code')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Assessment(models.Model):
    class Difficulty(models.TextChoices):
        BEGINNER = 'BEGINNER', 'Beginner'
        INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
        ADVANCED = 'ADVANCED', 'Advanced'

    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE, related_name='assessments')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField(default=60)
    passing_score = models.PositiveIntegerField(default=70) # percentage
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.INTERMEDIATE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def question_count(self):
        return self.questions.count()

    def __str__(self):
        return f"{self.title} ({self.difficulty})"

class Question(models.Model):
    class QuestionType(models.TextChoices):
        MCQ = 'mcq', 'Multiple Choice'
        CODE = 'code', 'Coding Challenge'
        DEBUG = 'debug', 'Code Debugging'

    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MCQ)
    title = models.CharField(max_length=255, blank=True, default='')
    difficulty = models.CharField(max_length=20, default='Easy')
    question_text = models.TextField()
    input_format = models.TextField(blank=True, default='')
    output_format = models.TextField(blank=True, default='')
    constraints = models.TextField(blank=True, default='')
    examples = models.JSONField(default=list, blank=True)
    language = models.CharField(max_length=50, default='python')
    options = models.JSONField(default=list, blank=True)  # list of strings: ["Option A", "Option B", ...]
    correct_option_index = models.PositiveSmallIntegerField(default=0)  # for MCQ
    starter_code = models.TextField(blank=True, default='')  # for Code challenges (Python)
    starter_code_java = models.TextField(blank=True, default='')  # for Code challenges (Java)
    sample_test_cases = models.JSONField(default=list, blank=True)  # visible sample tests: [{"inputs": [...], "expected": ...}]
    test_cases = models.JSONField(default=list, blank=True)  # full evaluation tests: [{"inputs": [...], "expected": ...}]
    function_name = models.CharField(max_length=100, default='solution')
    function_name_java = models.CharField(max_length=100, default='solution', blank=True)
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        prefix = self.title if self.title else self.question_text[:40]
        return f"Q{self.order} [{self.question_type} - {self.difficulty}]: {prefix}"

class AssessmentAttempt(models.Model):
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_attempts')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='attempts')
    score = models.PositiveIntegerField(default=0)
    percentage = models.PositiveIntegerField(default=0)
    passed = models.BooleanField(default=False)
    total_questions = models.PositiveIntegerField(default=10)
    correct_answers = models.PositiveIntegerField(default=0)
    mcq_score = models.PositiveIntegerField(default=0)
    coding_score = models.PositiveIntegerField(default=0)
    total_mcqs = models.PositiveIntegerField(default=5)
    total_coding = models.PositiveIntegerField(default=5)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.full_name} - {self.assessment.title}: {self.percentage}% ({'Passed' if self.passed else 'Failed'})"

class AssessmentResponse(models.Model):
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option_index = models.IntegerField(null=True, blank=True)
    code_answer = models.TextField(blank=True, default='')
    test_results = models.JSONField(default=dict, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Attempt {self.attempt.id} Q{self.question.id}: {'Correct' if self.is_correct else 'Incorrect'}"
