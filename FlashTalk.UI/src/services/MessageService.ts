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
  receiverId: string,
  token: string
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/messagesending/`;
  const body = JSON.stringify({ message, receiverId });
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
}

export function readMessagesByChat(
  chatId: string,
  token: string
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/messagereading/${chatId}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function sendFileMessage(file: File, receiverId: string, token: string) {
  const url = `${import.meta.env.VITE_API_URL}/messagesending/file/`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("receiverId", receiverId.toString());

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

// export function getFileMessage(token: string): Promise<Response> {
//   TODO: BACKEND API
//   const url = `${import.meta.env.VITE_API_URL}/messagesending/file/`;
//   return fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
