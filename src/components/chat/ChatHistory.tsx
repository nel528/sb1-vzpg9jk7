import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { Conversation } from '../../types/chat';
import { MessageSquare } from 'lucide-react';

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
}) => {
  return (
    <div className="w-64 bg-gray-50 border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Historique</h2>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentConversationId === conversation.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span className="text-sm font-medium truncate">
                  {conversation.messages[0]?.text.substring(0, 30)}...
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(new Date(conversation.updatedAt))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};