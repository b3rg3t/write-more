export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
