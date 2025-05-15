
export interface IMessage {
    id: number;
    chat_session_id: number;
    content: string;
    created_at: string;
    sender: 'ai' | 'user';
}