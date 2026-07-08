export type UserRole = "ADMIN" | "CASHIER" | "STAFF";

export interface LoginUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}