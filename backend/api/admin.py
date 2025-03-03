from django.contrib import admin
from .models import User


admin.site.register(User)
# Register your models here.

from django.contrib import admin
from .models import ChatMessage

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'content', 'timestamp')  # Customize fields shown in admin
    search_fields = ('user__email', 'content')  # Enable search by user email & message content
    list_filter = ('role', 'timestamp')  # Add filters for easier management
