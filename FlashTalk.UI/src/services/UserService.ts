import { User } from "../models/User";

export function getUsers(userName: string, token: string): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/UserSearch?name=${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getUserInfo(token: string): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/UserInfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function registerUser(user: User): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/UserRegistration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

export function authenticateUser(user: User): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/UserAuthentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
