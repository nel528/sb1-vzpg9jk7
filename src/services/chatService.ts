import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Message, Conversation } from '../types/chat';

export const getChatHistory = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Conversation));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const saveMessage = async (
  conversationId: string | null,
  message: Omit<Message, 'id'>,
  userId: string
): Promise<string> => {
  try {
    if (!conversationId) {
      // Create new conversation
      const newConversation = await addDoc(collection(db, 'conversations'), {
        messages: [message],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId
      });
      return newConversation.id;
    } else {
      // Update existing conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        messages: message,
        updatedAt: new Date().toISOString()
      });
      return conversationId;
    }
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};