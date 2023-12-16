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

export function sendFileMessage(
  files: FileList,
  receiverId: string,
  token: string
) {
  const url = `${import.meta.env.VITE_API_URL}/messagesending/file/`;
  const formData = new FormData();
  //TODO - multiple files (BACK-END)
  // for (let i = 0; i < files.length; i++) {
  //   formData.append("files", files[i]);
  // }
  formData.append("file", files[0]);
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
  chatId: string,
  fileName: string
): Promise<Response> {
  const url = `${
    import.meta.env.VITE_API_URL
  }/filedownloading/${chatId}/files/${fileName}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
