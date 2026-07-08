# PROJECT_OVERVIEW

> Entertained Bar POS - Project Overview (Draft v1)

## Goal

Design a fast, reliable POS for a small entertain bar.

## Current Entities (16)

1.  User
2.  UserSession
3.  Category
4.  Product
5.  Bill
6.  BillItem
7.  Payment
8.  Expense
9.  ExpenseCategory
10. AuditLog
11. DailyClosingSnapshot
12. Stock
13. StockMovement
14. OrderRequest
15. OrderRequestItem
16. SystemSetting

## Key Design Decisions

-   Product stores two prices:
    -   `normalPrice`
    -   `tournamentPrice`
-   SystemSetting stores only the active `PRICE_MODE`.
-   BillItem stores `unitPrice` and `lineTotal` permanently.
-   Product cannot be hard-deleted after sales exist; use `isActive`.
-   Staff submits OrderRequest; Cashier approves into Bill.
-   AuditLog records all important actions.
-   Stock and StockMovement are separated.
-   Expense feeds Daily Closing reports.
-   PromptPay number is stored in SystemSetting; QR is generated at
    print time.

## Next Documents

-   DATABASE_DESIGN.md
-   REQUIREMENTS.md
-   PRISMA_SCHEMA_PLAN.md

This is the first overview document. The remaining documents will
contain the full field-by-field specification.
