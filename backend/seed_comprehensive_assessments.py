"""
Seed Script: Comprehensive Skill Assessments (10 questions per course: 5 MCQs + 5 Coding Challenges)
Populates all 16 assessments across all tracks with authentic, LeetCode/HackerRank-inspired problems,
genuine unit tests, sample test cases, starter code, and detailed technical explanations.
"""

import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from assessments.models import Assessment, AssessmentCategory, Question

def seed_all_assessments():
    print("Starting Comprehensive Skill Assessment Seeding...")

    # Data dictionary mapping assessment slug to questions list (5 MCQs + 5 Coding challenges)
    from assessment_data import ASSESSMENTS_DATA

    total_created = 0

    for asm_slug, q_list in ASSESSMENTS_DATA.items():
        try:
            assessment = Assessment.objects.get(slug=asm_slug)
        except Assessment.DoesNotExist:
            print(f"Warning: Assessment with slug '{asm_slug}' does not exist in DB. Skipping.")
            continue

        # Clear existing questions for clean 10-question slate
        assessment.questions.all().delete()

        print(f"Populating Assessment: {assessment.title} ({asm_slug})...")

        for idx, q_data in enumerate(q_list):
            q_order = idx + 1
            Question.objects.create(
                assessment=assessment,
                order=q_order,
                question_type=q_data.get("question_type", Question.QuestionType.MCQ),
                title=q_data.get("title", f"Question {q_order}"),
                difficulty=q_data.get("difficulty", "Easy"),
                question_text=q_data.get("question_text", ""),
                input_format=q_data.get("input_format", ""),
                output_format=q_data.get("output_format", ""),
                constraints=q_data.get("constraints", ""),
                examples=q_data.get("examples", []),
                language=q_data.get("language", "python"),
                options=q_data.get("options", []),
                correct_option_index=q_data.get("correct_option_index", 0),
                starter_code=q_data.get("starter_code", ""),
                function_name=q_data.get("function_name", "solution"),
                sample_test_cases=q_data.get("sample_test_cases", []),
                test_cases=q_data.get("test_cases", []),
                explanation=q_data.get("explanation", "")
            )
            total_created += 1

        print(f"  -> Added {len(q_list)} questions to '{assessment.title}'.")

    print(f"\nSuccessfully seeded {total_created} total questions across {len(ASSESSMENTS_DATA)} assessments!")

if __name__ == '__main__':
    seed_all_assessments()
