import { User } from "./User";

export interface Message {
  id: string;
  createdAt: Date;
  sender: User;
  text: string;
  loading?: boolean;
  isRead: boolean;
  filePath?: string;
}
