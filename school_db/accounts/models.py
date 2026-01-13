from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'     
    REQUIRED_FIELDS = ['username']

    
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('parent',  'Parent'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    @property
    def is_teacher(self): return self.role == 'teacher'
    @property
    def is_parent(self):  return self.role == 'parent'
    @property
    def is_student(self): return self.role == 'student'

    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.CASCADE,
        related_name='kids',
        limit_choices_to={'role': 'parent'}
    )

class TeacherManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role='teacher')

class Teacher(User):
    objects = TeacherManager()
    class Meta:
        proxy = True
    def save(self, *a, **kw):
        self.role = 'teacher'
        super().save(*a, **kw)

class ParentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role='parent')

class Parent(User):
    objects = ParentManager()
    class Meta:
        proxy = True
    def save(self, *a, **kw):
        self.role = 'parent'
        super().save(*a, **kw)

class StudentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role='student')

class Student(User):
    objects = StudentManager()
    class Meta:
        proxy = True
    def save(self, *a, **kw):
        self.role = 'student'
        super().save(*a, **kw)