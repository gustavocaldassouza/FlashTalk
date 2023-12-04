import { User } from "../models/User";

export function getUsers(userName: string): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/usersearch?name=${userName}`);
}

export function getUserInfo(userId: string): User {
  const user: User = {
    id: "1",
    name: "John",
    email: "",
    password: "",
  };
  return user;
  // return fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
}

export function registerUser(user: User) {
  return fetch(`${import.meta.env.VITE_API_URL}/userregistration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
