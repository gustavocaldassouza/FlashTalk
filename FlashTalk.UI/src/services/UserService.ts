import { User } from "../models/User";
import { getApiUrl } from "../config/api";

export function getUsers(userName: string, token: string): Promise<Response> {
  return fetch(`${getApiUrl()}/UserSearch?name=${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getUserInfo(token: string): Promise<Response> {
  return fetch(`${getApiUrl()}/UserInfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function registerUser(user: User): Promise<Response> {
  return fetch(`${getApiUrl()}/UserRegistration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

export function authenticateUser(user: User): Promise<Response> {
  return fetch(`${getApiUrl()}/UserAuthentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
