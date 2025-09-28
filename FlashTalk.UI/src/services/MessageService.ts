import.meta.env.VITE_API_URL;

export function getMessages(token: string): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}/MessageReceiving`;
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
  const url = `${import.meta.env.VITE_API_URL}/MessageSending/`;
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
  const url = `${import.meta.env.VITE_API_URL}/MessageReading/${chatId}`;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function sendFileMessage(
  files: FileList,
  receiverId: string,
  token: string
) {
  const url = `${import.meta.env.VITE_API_URL}/MessageSending/file/`;
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  formData.append("receiverId", receiverId.toString());

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export function getFileMessage(
  token: string,
  messageId: string,
  fileName: string
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL
    }/FileDownloading/${messageId}/files/${fileName}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
