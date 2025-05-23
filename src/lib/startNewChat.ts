import client from "./graphql/apolloClient";
import { INSERT_CHAT_SESSION, INSERT_GUEST, INSERT_MESSAGE } from "./graphql/mutations";

const startNewChat = async (guestName: string, guestEmail: string, chatbotId: number) => {
    try {
        //* 1. Create a new guest entry
        const guestResult = await client.mutate({
            mutation: INSERT_GUEST,
            variables: {
                name: guestName,
                email: guestEmail,
            },
        });
        const guestId = guestResult.data.insertGuests.id;

        //* 2. Initialize a new chat session
        const chatSessionResult = await client.mutate({
            mutation: INSERT_CHAT_SESSION,
            variables: {
                guest_id: guestId,
                chatbot_id: chatbotId,
            },
        });
        const chatSessionId: number = chatSessionResult.data.insertChat_sessions.id;

        //* 3. Insert initial message (Optional)
        await client.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id: chatSessionId,
                content: `Welcome ${guestName}!\n How can I assist you today? 😊`, //? Can be customized if we want to get message from the backend
                sender: "ai",
            },
        });
        console.log("New chat session started successfully!");
        return chatSessionId;

    } catch (e) {
        console.error("Error starting new chat:", e);
    }
};

export default startNewChat;