from django.urls import path
from .views import AskAssistantView, ChatConversationListView, ChatConversationDetailView

urlpatterns = [
    path('chat/', AskAssistantView.as_view(), name='assistant-chat'),
    path('conversations/', ChatConversationListView.as_view(), name='assistant-conversations'),
    path('conversations/<int:pk>/', ChatConversationDetailView.as_view(), name='assistant-conversation-detail'),
]

