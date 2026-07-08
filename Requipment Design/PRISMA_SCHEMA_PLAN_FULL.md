# PRISMA_SCHEMA_PLAN_FULL

> Entertained BAR POS - Prisma Schema Planning Document

## Overview

This document is the master blueprint for implementing `schema.prisma`.

## Planned Models (16)

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

------------------------------------------------------------------------

# ENUMS

-   UserRole = ADMIN, CASHIER, STAFF
-   PriceMode = NORMAL, TOURNAMENT
-   BillStatus = OPEN, CREDIT, PAID, CANCELLED
-   PaymentMethod = CASH, TRANSFER
-   OrderRequestStatus = PENDING, APPROVED, REJECTED
-   StockMovementType = IN, OUT, ADJUST

------------------------------------------------------------------------

# MODEL PLANS

## User

Purpose: - Login account - Role management - PIN / Password
authentication

Suggested fields: - id - name - phone (unique) - password - pin - role -
isActive - createdAt - updatedAt

Relations: - Bills - Payments - Expenses - AuditLogs - OrderRequests -
StockMovements

------------------------------------------------------------------------

## Category

Fields: - id - name - description - isActive - createdAt - updatedAt

Relation: - Products (1:N)

------------------------------------------------------------------------

## Product

Fields: - id - categoryId - name - normalPrice - tournamentPrice -
isActive - createdAt - updatedAt

Rules: - Supports two selling prices. - Cannot Hard Delete after sales
history.

Relation: - Category - Stock - BillItems - StockMovements

------------------------------------------------------------------------

## Stock

Fields: - id - productId (unique) - currentQty - minimumQty - updatedAt

Rules: - Default quantity = 0 - Low-stock warning uses minimumQty.

------------------------------------------------------------------------

## StockMovement

Fields: - id - productId - userId - movementType - quantity - reason
(required) - createdAt

Rules: - IN updates stock immediately. - Never hard delete.

------------------------------------------------------------------------

## Bill

Fields: - id - billNo - customerName - status - totalAmount -
paidAmount - note - openedById - createdAt - updatedAt

------------------------------------------------------------------------

## BillItem

Fields: - id - billId - productId - productNameSnapshot - qty -
unitPrice - subtotal

Rule: - Stores aggregated items for cashier speed.

------------------------------------------------------------------------

## Payment

Fields: - id - billId - paymentMethod - amount - changeAmount -
paymentNote - receivedById - createdAt

Supports: - Cash - Transfer - Mixed payments

------------------------------------------------------------------------

## Expense

Fields: - id - title - category - amount - note - createdById -
createdAt

Used in daily closing report.

------------------------------------------------------------------------

## AuditLog

Fields: - id - userId - action - entity - targetId - targetName -
oldValue - newValue - ipAddress - deviceInfo - createdAt

Rules: - Keep DELETE history. - Preserve oldValue/newValue.

------------------------------------------------------------------------

## OrderRequest

Fields: - id - billId (optional) - requestedById - status - note -
createdAt - approvedAt

Purpose: Queue requests from Staff to Cashier.

------------------------------------------------------------------------

## OrderRequestItem

Fields: - id - orderRequestId - productId - qty - note

------------------------------------------------------------------------

## SystemSetting

Fields: - id - storeName - phone - receiptFooter - qrPaymentImage -
priceMode - createdAt - updatedAt

Purpose: Global application configuration.

------------------------------------------------------------------------

# RELATION SUMMARY

Category -\> Product

Product -\> Stock (1:1)

Product -\> StockMovement (1:N)

Bill -\> BillItem (1:N)

Bill -\> Payment (1:N)

OrderRequest -\> OrderRequestItem (1:N)

User -\> Bill / Payment / Expense / AuditLog / OrderRequest

------------------------------------------------------------------------

# DELETE POLICY

Master Data: - Hard delete only if never referenced. - Otherwise use
isActive.

Transaction Data: Never hard delete: - Bill - BillItem - Payment -
Expense - StockMovement - AuditLog - OrderRequest - OrderRequestItem

------------------------------------------------------------------------

# BUILD ORDER

1.  Enums
2.  User
3.  Category
4.  Product
5.  Stock
6.  StockMovement
7.  Bill
8.  BillItem
9.  Payment
10. Expense
11. AuditLog
12. OrderRequest
13. OrderRequestItem
14. SystemSetting

------------------------------------------------------------------------

# FINAL CHECKLIST

-   Two-price Product model
-   PriceMode in SystemSetting
-   QR receipt support
-   Audit trail
-   Inventory tracking
-   Order approval workflow
-   No hard delete for transactions
-   Low stock alert
