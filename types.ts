export interface Message {
    id: string;
    chatId: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}
  
export interface Chat {
    id: string;
    title: string;
    createdAt: Date;
}  