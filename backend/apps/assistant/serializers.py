from rest_framework import serializers
from .models import KnowledgeDocument, KnowledgeChunk, ChatConversation, ChatMessage

class KnowledgeChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeChunk
        fields = ['id', 'chunk_text', 'chunk_index', 'keywords']

class KnowledgeDocumentSerializer(serializers.ModelSerializer):
    chunk_count = serializers.IntegerField(source='chunks.count', read_only=True)

    class Meta:
        model = KnowledgeDocument
        fields = ['id', 'title', 'category', 'source', 'content', 'is_active', 'chunk_count', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'retrieved_sources', 'created_at']

class ChatConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatConversation
        fields = ['id', 'title', 'messages', 'created_at', 'updated_at']

class AskAssistantSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)

