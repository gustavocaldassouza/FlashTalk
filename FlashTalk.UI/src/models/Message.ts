import { FileModel } from "./FileModel";
import { User } from "./User";

export interface Message {
  id: string;
  createdAt: Date;
  sender: User;
  text: string;
  loading?: boolean;
  isRead: boolean;
  fileName?: string; //TODO - multiple files (BACK-END) < WILL BE REMOVED
  files?: FileModel[];
}
