import { type User } from "../../auth/types/userTypes";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: User;
  createdAt: string;
}
