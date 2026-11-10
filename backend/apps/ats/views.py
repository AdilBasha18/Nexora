import os
from io import BytesIO
from django.http import HttpResponse
from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import ATSAnalysis
from .serializers import ATSAnalysisSerializer, ATSCheckRequestSerializer
from .services import analyze_resume_independent, analyze_resume_with_job, generate_resume_improvements
from .role_presets import TARGET_ROLE_PRESETS
from resumes.models import Resume
from resumes.extractor import extract_text_from_file
from accounts.permissions import IsCandidate


class ATSPresetsView(views.APIView):
    """Returns the list of 25+ standard market role presets with skills & descriptions."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(TARGET_ROLE_PRESETS)


class ATSCheckView(views.APIView):
    """
    Unified ATS Checker:
    - Step 1: Independent analysis if job_title / job_description are empty.
    - Step 2: Job-matched analysis when job details are provided.
    - Accepts uploaded files (PDF/DOCX), resume_id, or resume_text.
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        resume_id = request.data.get('resume_id')
        custom_text = request.data.get('resume_text', '').strip()
        job_title = request.data.get('job_title', '').strip()
        job_description = request.data.get('job_description', '').strip()

        text_to_analyze = ""
        resume_obj = None

        # 1. Direct file upload (PDF/DOCX)
        if uploaded_file:
            try:
                text_to_analyze = extract_text_from_file(uploaded_file, uploaded_file.name)
            except Exception as e:
                return Response({"error": f"Failed to extract text from file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Saved resume selection
        elif resume_id:
            try:
                resume_obj = Resume.objects.get(pk=resume_id, user=request.user)
                text_to_analyze = resume_obj.extracted_text
            except Resume.DoesNotExist:
                return Response({"error": "Selected resume not found."}, status=status.HTTP_404_NOT_FOUND)

        # 3. Direct text fallback
        elif custom_text:
            text_to_analyze = custom_text

        # 4. Fallback to primary saved resume
        else:
            resume_obj = Resume.objects.filter(user=request.user, is_primary=True).first()
            if resume_obj and resume_obj.extracted_text:
                text_to_analyze = resume_obj.extracted_text
            else:
                return Response(
                    {"error": "Please provide a resume file (PDF/DOCX), select a saved resume, or paste resume text."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if not text_to_analyze or len(text_to_analyze.strip()) < 30:
            return Response(
                {"error": "Unable to extract sufficient readable text from the provided resume. Please verify the file is not a scanned image."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Determine analysis mode: Independent (Step 1) vs Job-Matched (Step 2)
        if job_title or job_description:
            analysis_result = analyze_resume_with_job(
                resume_text=text_to_analyze,
                job_title=job_title or "Software Developer",
                job_description=job_description
            )
        else:
            analysis_result = analyze_resume_independent(
                resume_text=text_to_analyze
            )

        # Persist analysis in database
        analysis_record = ATSAnalysis.objects.create(
            user=request.user,
            resume=resume_obj,
            job_title=job_title or "General ATS Independent Scan",
            job_description=job_description,
            overall_score=analysis_result['overall_score'],
            matched_skills=analysis_result.get('matched_skills', analysis_result.get('detected_skills', [])),
            missing_skills=analysis_result.get('missing_skills', []),
            keyword_analysis=analysis_result.get('matched_keywords', []),
            section_analysis=analysis_result.get('sections_found', {}),
            score_breakdown=analysis_result.get('measurable_criteria', {}),
            recommendations=analysis_result.get('suggestions', [])
        )

        return Response({
            "id": analysis_record.id,
            "created_at": analysis_record.created_at,
            "extracted_text": text_to_analyze,
            **analysis_result
        }, status=status.HTTP_201_CREATED)


class ATSImproveView(views.APIView):
    """
    Step 3: Resume Improvement Studio.
    Generates realistic, tailored improvements without inventing false credentials.
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request):
        resume_text = request.data.get('resume_text', '').strip()
        target_role = request.data.get('target_role', 'Software Professional').strip()
        missing_skills = request.data.get('missing_skills', [])

        if not resume_text:
            return Response({"error": "Resume text is required to generate improvements."}, status=status.HTTP_400_BAD_REQUEST)

        improvement_data = generate_resume_improvements(
            resume_text=resume_text,
            target_role=target_role,
            missing_skills=missing_skills
        )

        return Response(improvement_data, status=status.HTTP_200_OK)


class ATSDownloadImprovedView(views.APIView):
    """
    Allows candidates to download their improved resume in professional format (.docx or .txt).
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def post(self, request):
        resume_content = request.data.get('content', '').strip()
        format_type = request.data.get('format', 'docx').lower()
        candidate_name = request.user.full_name or "Candidate"

        if not resume_content:
            return Response({"error": "No resume content provided."}, status=status.HTTP_400_BAD_REQUEST)

        if format_type == 'txt':
            response = HttpResponse(resume_content, content_type='text/plain; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="{candidate_name.replace(" ", "_")}_Improved_Resume.txt"'
            return response

        # Generate DOCX
        try:
            import docx
            from docx.shared import Pt, Inches, RGBColor
            from docx.enum.text import WD_ALIGN_PARAGRAPH

            doc = docx.Document()
            
            # Margins
            for section in doc.sections:
                section.top_margin = Inches(0.75)
                section.bottom_margin = Inches(0.75)
                section.left_margin = Inches(0.75)
                section.right_margin = Inches(0.75)

            # Split lines
            lines = resume_content.split('\n')
            for line in lines:
                stripped = line.strip()
                if not stripped:
                    doc.add_paragraph()
                    continue

                if stripped.startswith('---'):
                    continue

                # Section Headers
                if stripped.isupper() and len(stripped) < 40:
                    p = doc.add_paragraph()
                    run = p.add_run(stripped)
                    run.font.name = 'Calibri'
                    run.font.size = Pt(13)
                    run.bold = True
                    run.font.color.rgb = RGBColor(0x0f, 0x17, 0x2a) # Navy
                    p.paragraph_format.space_before = Pt(8)
                    p.paragraph_format.space_after = Pt(2)
                elif stripped.startswith('•') or stripped.startswith('- '):
                    p = doc.add_paragraph(style='List Bullet')
                    run = p.add_run(stripped.lstrip('•- '))
                    run.font.name = 'Calibri'
                    run.font.size = Pt(10.5)
                else:
                    p = doc.add_paragraph()
                    run = p.add_run(stripped)
                    run.font.name = 'Calibri'
                    run.font.size = Pt(10.5)

            buffer = BytesIO()
            doc.save(buffer)
            buffer.seek(0)

            response = HttpResponse(
                buffer.getvalue(),
                content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
            response['Content-Disposition'] = f'attachment; filename="{candidate_name.replace(" ", "_")}_Improved_Resume.docx"'
            return response

        except Exception as e:
            # Fallback to plain text if docx has issues
            response = HttpResponse(resume_content, content_type='text/plain; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="{candidate_name.replace(" ", "_")}_Improved_Resume.txt"'
            return response


class ATSHistoryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request):
        history = ATSAnalysis.objects.filter(user=request.user).order_by('-created_at')[:10]
        return Response(ATSAnalysisSerializer(history, many=True).data)


class ATSDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get(self, request, pk):
        try:
            analysis = ATSAnalysis.objects.get(pk=pk, user=request.user)
            return Response(ATSAnalysisSerializer(analysis).data)
        except ATSAnalysis.DoesNotExist:
            return Response({"error": "Analysis not found."}, status=status.HTTP_404_NOT_FOUND)
