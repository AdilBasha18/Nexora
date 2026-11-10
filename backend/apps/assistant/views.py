from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import KnowledgeDocument, KnowledgeChunk, ChatConversation, ChatMessage
from .serializers import (
    KnowledgeDocumentSerializer, 
    ChatConversationSerializer, 
    ChatMessageSerializer, 
    AskAssistantSerializer
)
from .rag_engine import query_rag_assistant
from .ai_engine import generate_conversational_response
from accounts.permissions import IsCandidate, IsPlatformAdmin

class AskAssistantView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AskAssistantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_query = serializer.validated_data['message'].strip()
        conv_id = serializer.validated_data.get('conversation_id')

        # Retrieve or create conversation
        if conv_id:
            try:
                conversation = ChatConversation.objects.get(id=conv_id, user=request.user)
            except ChatConversation.DoesNotExist:
                return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = ChatConversation.objects.create(
                user=request.user,
                title=user_query[:50] + ("..." if len(user_query) > 50 else "")
            )

        # Retrieve prior conversation turns for multi-turn conversational context
        past_msgs = conversation.messages.order_by('created_at')[:10]
        history_list = [
            {"sender": m.sender, "message": m.message}
            for m in past_msgs
        ]

        # Record candidate message
        ChatMessage.objects.create(
            conversation=conversation,
            sender=ChatMessage.Sender.USER,
            message=user_query
        )

        # Run General-Purpose AI + RAG Architecture
        ai_result = generate_conversational_response(
            query=user_query,
            history=history_list,
            candidate=request.user
        )

        # Record assistant reply
        assistant_msg = ChatMessage.objects.create(
            conversation=conversation,
            sender=ChatMessage.Sender.ASSISTANT,
            message=ai_result['answer'],
            retrieved_sources=ai_result.get('sources', [])
        )

        conversation.save()  # update timestamp

        return Response({
            "conversation_id": conversation.id,
            "message": ChatMessageSerializer(assistant_msg).data,
            "sources": ai_result.get('sources', []),
            "grounded": ai_result.get('grounded', False),
            "model": ai_result.get('model', 'nexora-engine-v1')
        }, status=status.HTTP_200_OK)

class ChatConversationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        conversations = ChatConversation.objects.filter(user=request.user).order_by('-updated_at')[:15]
        return Response(ChatConversationSerializer(conversations, many=True).data)

    def delete(self, request):
        # Clear chat history for user
        ChatConversation.objects.filter(user=request.user).delete()
        return Response({"message": "Conversation history cleared."}, status=status.HTTP_200_OK)

class ChatConversationDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            conv = ChatConversation.objects.prefetch_related('messages').get(pk=pk, user=request.user)
            return Response(ChatConversationSerializer(conv).data)
        except ChatConversation.DoesNotExist:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            conv = ChatConversation.objects.get(pk=pk, user=request.user)
            conv.delete()
            return Response({"message": "Conversation deleted."})
        except ChatConversation.DoesNotExist:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

