from django.db import models

# Models for the CV portfolio application

class Profile(models.Model):
    full_name = models.CharField(max_length=200, blank=True)
    job_title = models.CharField(max_length=200, blank=True)
    # By setting .EmailField this will validate that the input is a valid email address format
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    # By setting .URLField this will validate that the input is a valid URL format
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)

    def __str__(self):
        return self.full_name
    
class WorkExperience(models.Model):
    job_title = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=200, blank=True)
    company_url = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.job_title} at {self.company}"

    class Meta:
        ordering = ['order', '-start_date']

class Education(models.Model):
    institution = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    field_of_study = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    grade = models.CharField(max_length=100, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.degree} at {self.institution}"

    class Meta:
        ordering = ['order', '-start_date']

class Skill(models.Model):

    # Constants are conventionally defined in uppercase, and they represent fixed values that are not expect to change.
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('tools', 'Tools'),
        ('soft_skills', 'Soft Skills'),
    ]

    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    name = models.CharField(max_length=100, blank=True)
    proficiency = models.CharField(max_length=12, choices=PROFICIENCY_CHOICES, blank=True)
    category = models.CharField(max_length=12, choices=CATEGORY_CHOICES, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order', 'name']

class Project(models.Model):
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    tech_stack = models.CharField(max_length=200, blank=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order', 'title']