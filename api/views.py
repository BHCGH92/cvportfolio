from rest_framework import generics
from cv.models import Profile, Skill, WorkExperience, Education, Project
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
