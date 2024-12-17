import React from 'react';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-blue-100' : 'bg-green-100'}`}>
        {isBot ? <Bot size={20} className="text-blue-600" /> : <User size={20} className="text-green-600" />}
      </div>
      <div className={`flex flex-col max-w-[80%] ${isBot ? '' : 'items-end'}`}>
        <div className={`rounded-lg px-4 py-2 ${isBot ? 'bg-blue-50' : 'bg-green-50'}`}>
          <p className="text-gray-800">{message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      </div>
    </div>
  );
}