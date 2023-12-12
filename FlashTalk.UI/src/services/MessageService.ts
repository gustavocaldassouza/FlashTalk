import.meta.env.VITE_API_URL;

export function getMessages(token: string): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/messagereceiving`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function sendMessage(
  message: string,
  senderId: number,
  receiverId: number,
  token: string
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/messagesending/`;
  const body = JSON.stringify({ message, senderId, receiverId });
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
}
