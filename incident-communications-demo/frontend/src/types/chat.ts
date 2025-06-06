export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
    conversation_id?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
} 