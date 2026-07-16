export type UserRole =
  | "ADMIN"
  | "CASHIER"
  | "STAFF";


export interface LoginUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
}