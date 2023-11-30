import.meta.env.VITE_API_URL;

class MessageReceivingService {
  getMessages(userId: string): Promise<Response> {
    const url = `${import.meta.env.VITE_API_URL}/messagereceiving/${userId}`;
    return fetch(url);
  }
}

export default MessageReceivingService;
