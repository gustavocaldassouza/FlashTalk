import.meta.env.VITE_API_URL;

class MessageSendingService {
  sendMessage(
    message: string,
    senderId: number,
    receiverId: number
  ): Promise<Response> {
    const url = `${import.meta.env.VITE_API_URL}/messagesending/`;
    const body = JSON.stringify({ message, senderId, receiverId });
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  }
}

export default MessageSendingService;
