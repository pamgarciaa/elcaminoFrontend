export interface User {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  role: "user" | "moderator" | "admin";
  profilePicture?: string;
  address?: string;
  phone?: string;
}
