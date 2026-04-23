from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('skills/', views.SkillView.as_view(), name='skills'),
    path('work-experience/', views.WorkExperienceView.as_view(), name='work-experience'),
    path('education/', views.EducationView.as_view(), name='education'),
    path('projects/', views.ProjectView.as_view(), name='projects'),
]
