import { User } from "./User";

export interface Message {
  id: string;
  createdAt: string;
  sender: User;
  text: string;
}
