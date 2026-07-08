# REQUIREMENTS

> Entertained Bar POS - Functional Requirements (Draft)

## 1. User & Authentication

-   Roles: Admin, Cashier, Staff
-   Admin creates all users.
-   Login by username/password or PIN.
-   Future support: Face ID / Fingerprint (client-side).
-   UserSession tracks online/offline status.

## 2. Product & Pricing

-   Every product has:
    -   normalPrice
    -   tournamentPrice
-   Cashier selects PRICE_MODE when opening the shop.
-   Entire POS theme changes to indicate mode.
-   BillItem stores snapshot price.

## 3. Billing

-   Open bill by customer identifier.
-   No table management.
-   Bills remain OPEN until payment.
-   BillItem aggregates displayed quantity while AuditLog preserves
    history.

## 4. Staff Ordering

-   Staff can view OPEN bills.
-   Staff submits OrderRequest.
-   Cashier approves or rejects.
-   Approved requests become BillItems.
-   Closed bills disappear from Staff screen.

## 5. Payments

-   Support Cash, Transfer, Mixed.
-   Support partial payment (Credit).
-   Store received amount, change amount and note.
-   Receipt prints PromptPay QR.

## 6. Expenses

-   Record all daily expenses.
-   Categorize expenses.
-   Daily Closing automatically includes expense totals.

## 7. Inventory

-   Stock keeps current quantity.
-   StockMovement records every adjustment.
-   Purchase increases stock immediately.
-   Manual stock adjustment requires reason.
-   Low stock warning based on minimumQty.

## 8. Reports

Admin: - Daily / Monthly / Yearly - Graphs - Sales - Expenses - Profit

Cashier: - Daily reports only.

Staff: - Personal income and drink history.

## 9. Audit

-   Log important actions.
-   Record old/new values.
-   Product cannot be hard deleted after sales exist.
-   Transaction history is immutable.

## 10. Daily Closing

Snapshot includes: - Total sales - Cash - Transfer - Credit - Staff
drinks - Expenses - Net income

## 11. Future Reserved Features

-   Face ID
-   Fingerprint
-   PromptPay QR generation
-   Tournament Theme
-   Advanced Analytics
-   Purchase module

## Design Principles

-   Fast cashier workflow.
-   Preserve historical data.
-   Avoid duplicate records.
-   Snapshot financial values.
-   Audit every critical operation.
