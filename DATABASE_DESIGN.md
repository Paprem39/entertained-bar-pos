# Database Design

## Entities

### User

id, name, phone, password, pin, role, isActive, createdAt, updatedAt

### Category

id, name, isActive, createdAt, updatedAt

### Product

id, name, price, categoryId, allowMixer, isActive, createdAt, updatedAt

### Bill

id, billNo, billName, status, openedById, totalAmount, itemCount, note,
createdAt, updatedAt, closedAt, paidAmount, isEventBill, eventDate

### BillItem

id, billId, productId, productName, quantity, unitPrice, lineTotal,
mixers, drinkRecipientName, drinkFee, createdAt, updatedAt

### Payment

id, billId, amount, paymentMethod, paidById, note, paidAt, createdAt,
updatedAt, receivedAmount, changeAmount

### Expense

id, title, amount, expenseType, note, expenseDate, createdAt, updatedAt

### AuditLog

id, userId, billId, action, description, createdAt
