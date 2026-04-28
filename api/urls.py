from django.urls import path
from .views import ProfileView, WorkExperienceView, EducationView, SkillView, ProjectView, ChatView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('skills/', SkillView.as_view(), name='skills'),
    path('work-experience/', WorkExperienceView.as_view(), name='work-experience'),
    path('education/', EducationView.as_view(), name='education'),
    path('projects/', ProjectView.as_view(), name='projects'),
    path('chat/', ChatView.as_view(), name='chat'),
]