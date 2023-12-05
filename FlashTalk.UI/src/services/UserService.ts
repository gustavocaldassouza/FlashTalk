import { User } from "../models/User";

export function getUsers(userName: string): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/usersearch?name=${userName}`);
}

export function getUserInfo(userId: string): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/userinfo?userId=${userId}`);
}

export function registerUser(user: User): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/userregistration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

export function authenticateUser(user: User): Promise<Response> {
  return fetch(`${import.meta.env.VITE_API_URL}/userauthentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
