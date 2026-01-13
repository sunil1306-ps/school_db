from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'role', 'is_staff')
    list_filter  = ('role', 'is_staff')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra', {'fields': ('role',)}),
    )

    # add parent to the edit form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra', {'fields': ('role', 'parent')}),
    )

    # when creating a user via admin
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Extra', {'fields': ('role', 'parent')}),
    )