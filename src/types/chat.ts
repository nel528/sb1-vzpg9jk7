export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  userId: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}