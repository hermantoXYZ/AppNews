from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from unfold.admin import ModelAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin, ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'bio', 'profile_picture')}),
        ('Roles and Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_superuser'),
        }),
    )

    # Custom admin actions
    actions = ['make_admin', 'make_contributor']

    @admin.action(description='Make selected users Admin')
    def make_admin(self, request, queryset):
        queryset.update(role='admin')
        self.message_user(request, f'Successfully updated {queryset.count()} users to Admin role.')

    @admin.action(description='Make selected users Contributor')
    def make_contributor(self, request, queryset):
        queryset.update(role='contributor')
        self.message_user(request, f'Successfully updated {queryset.count()} users to Contributor role.')
