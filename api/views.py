import os
import google.generativeai as genai
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.conf import settings
from cv.models import Profile, WorkExperience, Education, Skill, Project
from .serializers import ProfileSerializer, WorkExperienceSerializer, EducationSerializer, SkillSerializer, ProjectSerializer

class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class SkillView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class WorkExperienceView(generics.ListAPIView):
    queryset = WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer

class EducationView(generics.ListAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class ProjectView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return None

class ChatView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
        question = request.data.get('message', '')

        if not question:
            return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)

        profile = Profile.objects.first()
        experiences = WorkExperience.objects.all()
        education = Education.objects.all()
        skills = Skill.objects.all()
        projects = Project.objects.all()

        cv_context = f"""
        Name: {profile.full_name if profile else 'Not provided'}
        Job Title: {profile.job_title if profile else 'Not provided'}
        Location: {profile.location if profile else 'Not provided'}
        Bio: {profile.bio if profile else 'Not provided'}

        Work Experience:
        {chr(10).join([f'- {exp.job_title} at {exp.company} ({exp.start_date} - {"Present" if exp.is_current else exp.end_date}): {exp.description}' for exp in experiences])}

        Education:
        {chr(10).join([f'- {edu.degree} at {edu.institution} ({edu.start_date} - {"Present" if edu.is_current else edu.end_date})' for edu in education])}

        Skills:
        {chr(10).join([f'- {skill.name} ({skill.category} - {skill.proficiency})' for skill in skills])}

        Projects:
        {chr(10).join([f'- {proj.title}: {proj.description} (Tech: {proj.tech_stack})' for proj in projects])}
        """

        genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-2.5-flash')

        system_prompt = f"""You are a helpful assistant that answers questions about Ben Holt's CV and professional background. 
        You should only answer questions related to Ben's professional experience, skills, education and projects.
        If asked about anything unrelated to Ben's CV, politely redirect the conversation back to his professional background.
        Keep answers concise, friendly and professional.
        
        Here is Ben's CV data:
        {cv_context}
        """

        response = model.generate_content(system_prompt + "\n\nQuestion: " + question)

        return Response({'response': response.text})

# Only apply rate limiting in production
if not settings.DEBUG:
    ChatView = method_decorator(
        ratelimit(key='ip', rate='20/d', method='POST', block=True),
        name='dispatch'
    )(ChatView)