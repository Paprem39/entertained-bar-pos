# DATABASE_DESIGN

> Entertained Bar POS - Database Design (Draft Structure)

## Entity List (16)

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

## User

Purpose: - Store all system users.

Main Fields: - id - username - fullName - phone - passwordHash -
pinHash - role - isActive - createdAt - updatedAt

Relations: - User -\> Bills - User -\> Payments - User -\> Expenses -
User -\> AuditLogs - User -\> UserSessions

------------------------------------------------------------------------

## Product

Purpose: - Store sellable items.

Important Fields: - id - categoryId - name - normalPrice -
tournamentPrice - allowMixer - isActive - createdAt - updatedAt

Business Notes: - Two prices are stored permanently. - POS chooses price
based on SystemSetting.PRICE_MODE. - Never overwrite historical BillItem
prices.

------------------------------------------------------------------------

## Bill

Stores bill header.

Related: - BillItems - Payments

------------------------------------------------------------------------

## BillItem

Stores line items.

Important: - unitPrice (snapshot) - quantity - lineTotal (snapshot) -
note

Never recalculate historical values after payment.

------------------------------------------------------------------------

## Payment

Stores every payment transaction.

Supports: - Cash - Transfer - Mixed payment - Credit balance

Stores: - receivedAmount - changeAmount - paymentNote

------------------------------------------------------------------------

## Expense / ExpenseCategory

ExpenseCategory defines categories. Expense stores daily expenses.

Expense is included in Daily Closing Report.

------------------------------------------------------------------------

## Stock

Current inventory.

Fields include: - currentQty - minimumQty

------------------------------------------------------------------------

## StockMovement

Append-only inventory history.

Reasons required.

------------------------------------------------------------------------

## OrderRequest / OrderRequestItem

Staff requests. Cashier approves.

Header / Detail structure.

------------------------------------------------------------------------

## AuditLog

Append-only.

Stores: - action - entity - targetId - oldValue - newValue - ipAddress -
deviceInfo

------------------------------------------------------------------------

## DailyClosingSnapshot

Immutable end-of-day report.

Stores finalized daily sales snapshot.

------------------------------------------------------------------------

## SystemSetting

Key / Value configuration.

Examples: - SHOP_NAME - SHOP_PHONE - LOGO - PRICE_MODE -
PROMPTPAY_NUMBER - RECEIPT_FOOTER

------------------------------------------------------------------------

> Full field specification and relations will be expanded in the final
> design document.
