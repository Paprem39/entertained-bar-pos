import { LoginUser } from "@/types/user";

export const mockUsers: LoginUser[] = [
  {
    id: "1",
    username: "Admin00",
    displayName: "Admin",
    role: "ADMIN",
    isActive: true,
  },
  {
    id: "2",
    username: "Ca00",
    displayName: "Cashier",
    role: "CASHIER",
    isActive: true,
  },
  {
    id: "3",
    username: "St00",
    displayName: "Staff A",
    role: "STAFF",
    isActive: true,
  },
  {
    id: "4",
    username: "St01",
    displayName: "Staff B",
    role: "STAFF",
    isActive: true,
  },
];