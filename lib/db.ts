import { Chat, Message } from '@/types';
import Dexie from 'dexie';

export class ChatDB extends Dexie {
    chats!: Dexie.Table<Chat, string>;
    messages!: Dexie.Table<Message, string>;
    
    constructor() {
        super('ChatDatabase');
        
        this.version(1).stores({
            chats: 'id, title, createdAt',
            messages: 'id, chatId, content, role, timestamp'
        });
    }
}
  
  export const db = new ChatDB();