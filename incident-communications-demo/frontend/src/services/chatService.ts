import axios, { AxiosError } from 'axios';
import { Message } from '../types/chat';

const API_URL = 'http://localhost:8002';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const chatService = {
    async sendMessage(content: string, conversationId?: string): Promise<Message> {
        console.log('📤 Sending message:', {
            content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            conversationId,
            timestamp: new Date().toISOString()
        });

        try {
            const response = await axiosInstance.post<{ response: string; conversation_id: string }>('/api/chat', {
                message: content,
                conversation_id: conversationId
            });
            
            console.log('📥 Received response:', {
                conversation_id: response.data.conversation_id,
                response_length: response.data.response.length,
                timestamp: new Date().toISOString()
            });
            
            // Convert the response to match our Message interface
            const message: Message = {
                id: response.data.conversation_id,
                content: response.data.response,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                conversation_id: response.data.conversation_id
            };
            
            console.log('✅ Processed message:', {
                id: message.id,
                role: message.role,
                conversation_id: message.conversation_id,
                content_length: message.content.length
            });
            
            return message;
        } catch (error) {
            console.error('❌ API Error:', {
                error: error instanceof AxiosError ? {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                } : error,
                timestamp: new Date().toISOString()
            });
            throw new Error('Failed to send message');
        }
    },

    async getMessageHistory(): Promise<Message[]> {
        console.log('📋 Fetching message history');
        try {
            const response = await axiosInstance.get<Message[]>('/api/chat/history');
            console.log('📋 Retrieved message history:', {
                message_count: response.data.length,
                timestamp: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching message history:', {
                error: error instanceof AxiosError ? {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                } : error,
                timestamp: new Date().toISOString()
            });
            throw new Error('Failed to fetch message history');
        }
    }
}; 