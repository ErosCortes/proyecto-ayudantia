from django.contrib import admin
from .models import Course, Tutorship, TutorshipHistory, UserProfile

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'created_at')
    search_fields = ('code', 'name')
    ordering = ('-created_at',)

@admin.register(Tutorship)
class TutorshipAdmin(admin.ModelAdmin):
    list_display = ('course', 'teacher', 'student', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('course__name', 'teacher__email', 'student__email')
    ordering = ('-created_at',)

@admin.register(TutorshipHistory)
class TutorshipHistoryAdmin(admin.ModelAdmin):
    list_display = ('tutorship', 'action', 'changed_by', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('tutorship__course__name', 'changed_by__email')
    ordering = ('-timestamp',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__email', 'role')
    ordering = ('-created_at',)
