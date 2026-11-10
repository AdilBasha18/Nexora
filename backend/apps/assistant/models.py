from django.db import models
from django.conf import settings

class KnowledgeDocument(models.Model):
    class Category(models.TextChoices):
        RESUME = 'RESUME', 'Resume & ATS'
        INTERVIEW = 'INTERVIEW', 'Interview Preparation'
        ROADMAP = 'ROADMAP', 'Career Roadmaps & Skills'
        SYSTEM_DESIGN = 'SYSTEM_DESIGN', 'System Architecture & Coding'
        GENERAL = 'GENERAL', 'General Career Advisory'

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.GENERAL)
    source = models.CharField(max_length=255, default='Nexora Career Knowledge Base')
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.source})"

class KnowledgeChunk(models.Model):
    document = models.ForeignKey(KnowledgeDocument, on_delete=models.CASCADE, related_name='chunks')
    chunk_text = models.TextField()
    chunk_index = models.PositiveIntegerField(default=0)
    keywords = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['chunk_index']

    def __str__(self):
        return f"Chunk {self.chunk_index} of {self.document.title}"

class ChatConversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_conversations')
    title = models.CharField(max_length=255, default='Career Consultation')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name}: {self.title}"

class ChatMessage(models.Model):
    class Sender(models.TextChoices):
        USER = 'USER', 'Candidate'
        ASSISTANT = 'ASSISTANT', 'Nexora AI Assistant'

    conversation = models.ForeignKey(ChatConversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=Sender.choices)
    message = models.TextField()
    retrieved_sources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.sender}] {self.message[:40]}..."

