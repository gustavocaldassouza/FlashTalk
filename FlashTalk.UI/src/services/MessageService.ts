import.meta.env.VITE_API_URL;

export function getMessages(userId: string): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/messagereceiving/${userId}`;
  return fetch(url);
}

export function sendMessage(
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
