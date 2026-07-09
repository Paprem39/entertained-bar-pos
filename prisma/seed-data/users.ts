import { UserRole } from "@prisma/client";

export const users = [
  {
    username: "Admin00",
    password: "admin",
    pin: "2625",
    displayName: "Admin",
    role: UserRole.ADMIN,
  },
  {
    username: "Ca00",
    password: "123456",
    pin: "1111",
    displayName: "Cashier",
    role: UserRole.CASHIER,
  },
  {
    username: "St00",
    password: "123456",
    pin: "0000",
    displayName: "Staff",
    role: UserRole.STAFF,
  },
] as const;