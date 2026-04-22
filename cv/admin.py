from django.contrib import admin
from .models import Profile, WorkExperience, Education, Skill, Project

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'job_title', 'email', 'phone', 'location')
    search_fields = ('full_name', 'job_title', 'email', 'phone', 'location')

class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company', 'location', 'start_date', 'end_date', 'is_current')
    search_fields = ('job_title', 'company', 'location')

class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'field_of_study', 'start_date', 'end_date', 'is_current')
    search_fields = ('degree', 'institution', 'field_of_study')

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category')

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_stack')
    search_fields = ('title', 'tech_stack')

admin.site.register(Profile, ProfileAdmin)
admin.site.register(WorkExperience, WorkExperienceAdmin)
admin.site.register(Education, EducationAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Project, ProjectAdmin)
