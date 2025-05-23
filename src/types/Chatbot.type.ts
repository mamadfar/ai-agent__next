
export interface IInsertChatbot {
    insertChatbots: {
        id: string;
        name: string;
    }
}

export interface IChatbot {
    id: number;
    clerk_user_id: string;
    name: string;
    created_at: string;
    chatbot_characteristics: IChatbotCharacteristic[];
    chat_sessions: IChatSession[];
}

export interface IChatbotCharacteristic {
    id: number;
    chatbot_id: number;
    content: string;
    created_at: string;
}

export interface IGuest {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface IMessage {
    id: number;
    chat_session_id: number;
    content: string;
    created_at: string;
    sender: 'ai' | 'user';
}

export interface IChatSession {
    id: number;
    chatbot_id: number;
    guest_id: string | null;
    created_at: string;
    messages: IMessage[];
    guests: IGuest;
}

export interface IGetChatbotByIdResponse {
    chatbots: IChatbot;
}

export interface IGetChatbotByIdVariables {
    id: string;
}

export interface IGetChatbotsByUserResponse {
    chatbotsByUser: IChatbot[];
}

export interface IGetChatbotsByUserVariables {
    clerk_user_id: string;
}

export interface IGetUserChatbotsResponse {
    chatbotsByUser: IChatbot[];
}

export interface IGetUserChatbotsVariables {
    userId: string;
}

export interface IGetChatSessionMessagesResponse {
    chat_sessions: {
        id: number;
        created_at: string;
        messages: IMessage[];
        chatbots: {
            name: string;
        };
        guests: {
            name: string;
            email: string;
        };
    };
}
export interface IGetChatSessionMessagesVariables {
    id: number;
}

export interface IMessagesByChatSessionIdResponse {
    chat_sessions: IChatSession;
}

export interface IMessagesByChatSessionIdVariables {
   chat_session_id: number;
}