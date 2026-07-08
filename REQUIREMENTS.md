# Functional Requirements

## Staff Drink

-   Add configurable drink fee (default 50 THB).
-   Recipient can be staff or external person.
-   Store recipient name in BillItem.

## Mixed Spirits

-   Spirit price comes from the selected spirit.
-   Mixers are displayed but normally do not affect spirit price.

## Credit Bills

-   Bill status = CREDIT.
-   Not counted as sales until payment is received.

## Event Bills

-   Flag with isEventBill.
-   Store eventDate.
-   Upcoming event list shows only future events.

## Audit

-   Keep operational history.
-   Bill UI stays summarized.
-   History is available for verification.

## Daily Report

-   Total sales
-   Cash total
-   Transfer total
-   Expenses
-   Staff drink payouts
-   Net income
