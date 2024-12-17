import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { formatTimestamp } from '../../utils/dateUtils';
import { sendMessageToMistral } from '../../services/api';
import { getChatHistory, saveMessage } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Message, Conversation } from '../../types/chat';

export const ChatContainer: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          const history = await getChatHistory(user.id);
          setConversations(history);
          if (history.length > 0) {
            setCurrentConversationId(history[0].id);
            setMessages(history[0].messages);
          } else {
            // Start new conversation with welcome message
            const welcomeMessage: Omit<Message, 'id'> = {
              text: `Bonjour ${user.name}! Comment puis-je vous aider aujourd'hui?`,
              isBot: true,
              timestamp: formatTimestamp(new Date()),
              userId: user.id
            };
            const conversationId = await saveMessage(null, welcomeMessage, user.id);
            setCurrentConversationId(conversationId);
            setMessages([{ ...welcomeMessage, id: '1' }]);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
      setIsLoading(false);
    };

    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    const userMessage: Omit<Message, 'id'> = {
      text,
      isBot: false,
      timestamp: formatTimestamp(new Date()),
      userId: user.id
    };

    try {
      await saveMessage(currentConversationId, userMessage, user.id);
      setMessages(prev => [...prev, { ...userMessage, id: String(prev.length + 1) }]);

      const response = await sendMessageToMistral(text);
      const botMessage: Omit<Message, 'id'> = {
        text: response,
        isBot: true,
        timestamp: formatTimestamp(new Date()),
        userId: user.id
      };

      await saveMessage(currentConversationId, botMessage, user.id);
      setMessages(prev => [...prev, { ...botMessage, id: String(prev.length + 1) }]);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      const errorMessage: Omit<Message, 'id'> = {
        text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        isBot: true,
        timestamp: formatTimestamp(new Date()),
        userId: user.id
      };
      setMessages(prev => [...prev, { ...errorMessage, id: String(prev.length + 1) }]);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ChatHistory
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
      />
      
      <div className="flex flex-1 flex-col">
        <div className="bg-white shadow">
          <div className="mx-auto max-w-3xl px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">ChatBot</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};