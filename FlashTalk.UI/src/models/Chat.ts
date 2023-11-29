import { Message } from "./Message";
import { User } from "./User";

export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  owner: User;
  messages: Message[];
  participants: User[];
}
