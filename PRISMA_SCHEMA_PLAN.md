# Prisma Schema Plan

## Enums

### Role

-   ADMIN
-   CASHIER
-   STAFF

### BillStatus

-   OPEN
-   PAID
-   CREDIT
-   CANCELLED

### PaymentMethod

-   CASH
-   TRANSFER

### ExpenseType

Examples: - SALARY - STAFF_DRINK - ICE - PURCHASE - OTHER

## Design Notes

-   Prefer enum instead of String for fixed values.
-   Keep AuditLog separate from Bill/BillItem.
-   Bill stores summary.
-   BillItem stores line items.
-   Payment supports split payments and received/change amounts.
