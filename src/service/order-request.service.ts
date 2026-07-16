import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import {
  CreateOrderRequestInput,
  ApproveOrderRequestInput,
  RejectOrderRequestInput,
} from "@/types/order-request";

import { validateOrderRequest } from "@/utils/order-request/validate-order-request";
import { createOrderRequestItems } from "@/utils/order-request/create-order-request-items";
import { approveValidation } from "@/utils/order-request/approve-validation";
import { mergeBillItem } from "@/utils/order-request/merge-bill-item";
import { createBillItem } from "@/utils/order-request/create-bill-item";
import { updateBillTotal } from "@/utils/order-request/update-bill-total";
import { rejectValidation } from "@/utils/order-request/reject-validation";
import { CancelOrderRequestInput } from "@/types/order-request";
import { cancelValidation } from "@/utils/order-request/cancel-validation";

export async function createOrderRequest(
    input: CreateOrderRequestInput,
  ) {
    return await prisma.$transaction(async (tx) => {
      // ============================
      // Validate
      // ============================
  
      await validateOrderRequest({
        prisma: tx,
        input,
      });
  
      // ============================
      // Create Order Request
      // ============================
  
      const orderRequest = await tx.orderRequest.create({
        data: {
          billId: input.billId,
  
          requestedByUserId: input.requestedByUserId,
  
          status: "PENDING",
  
          note: input.note,
        },
      });
  
      // ============================
      // Create Items
      // ============================
  
      await createOrderRequestItems({
        prisma: tx,
        orderRequestId: orderRequest.id,
        input,
      });
  
      // ============================
      // Audit Log
      // ============================
  
      await tx.auditLog.create({
        data: {
          userId: input.requestedByUserId,
  
          action: "CREATE",
  
          entityType: "OrderRequest",
  
          entityId: orderRequest.id,
  
          targetName: orderRequest.id,
  
          description: "Staff created order request.",
  
          newValue: {
            status: "PENDING",
            billId: input.billId,
          },
        },
      });
  
      // ============================
      // Return
      // ============================
  
      return await tx.orderRequest.findUnique({
        where: {
          id: orderRequest.id,
        },
        include: {
          requestedBy: true,
  
          approvedBy: true,
  
          items: {
            include: {
              mixers: {
                include: {
                  mixerProduct: true,
                },
              },
  
              product: true,
            },
          },
  
          bill: true,
        },
      });
    });
  }

  export async function approveOrderRequest(
    input: ApproveOrderRequestInput,
  ) {
    return await prisma.$transaction(async (tx) => {
  
      // ============================
      // Validate
      // ============================
  
      const {
        user,
        orderRequest,
      } = await approveValidation({
        prisma: tx,
        orderRequestId: input.orderRequestId,
        approvedByUserId: input.approvedByUserId,
      });
  
      // ============================
      // Move OrderRequest -> Bill
      // ============================
  
      for (const item of orderRequest.items) {
  
        const price = item.product.tournamentPrice ??
          item.product.normalPrice;
  
        const merged = await mergeBillItem({
          prisma: tx,
  
          billId: orderRequest.billId,
  
          productId: item.productId,
  
          qty: item.quantity,
  
          unitPrice: price,
  
          isStaffDrink: item.isStaffDrink,
  
          staffDrinkFee: item.staffDrinkFee,
  
          staffDrinkRecipient: item.staffDrinkRecipient,
  
          addedByUserId: orderRequest.requestedByUserId,
  
          mixers: item.mixers.map((mixer) => ({
            mixerProductId: mixer.mixerProductId,
            mixerName: mixer.mixerName,
          })),
        });
  
        if (!merged) {
  
          await createBillItem({
            prisma: tx,
  
            billId: orderRequest.billId,
  
            productId: item.productId,
  
            productName: item.productName,
  
            qty: item.quantity,
  
            unitPrice: price,
  
            isStaffDrink: item.isStaffDrink,
  
            staffDrinkFee: item.staffDrinkFee,
  
            staffDrinkRecipient: item.staffDrinkRecipient,
  
            addedByUserId: orderRequest.requestedByUserId,
  
            mixers: item.mixers.map((mixer) => ({
              mixerProductId: mixer.mixerProductId,
              mixerName: mixer.mixerName,
            })),
          });
  
        }
  
      }
  
      // ============================
      // Update Bill Total
      // ============================
  
      await updateBillTotal({
        prisma: tx,
        billId: orderRequest.billId,
      });
  
      // ============================
      // Approve Order Request
      // ============================
  
      const approvedOrderRequest =
        await tx.orderRequest.update({
          where: {
            id: orderRequest.id,
          },
          data: {
            status: "APPROVED",
            approvedByUserId: user.id,
            approvedAt: new Date(),
          },
        });
  
      // ============================
      // Audit Log
      // ============================
  
      await tx.auditLog.create({
        data: {
          userId: user.id,
  
          action: "APPROVE",
  
          entityType: "OrderRequest",
  
          entityId: orderRequest.id,
  
          targetName: orderRequest.id,
  
          description: "Cashier approved order request.",
  
          oldValue: {
            status: "PENDING",
          },
  
          newValue: {
            status: "APPROVED",
          },
        },
      });
  
      // ============================
      // Return
      // ============================
  
      return await tx.orderRequest.findUnique({
        where: {
          id: approvedOrderRequest.id,
        },
        include: {
          requestedBy: true,
  
          approvedBy: true,
  
          bill: true,
  
          items: {
            include: {
              product: true,
  
              mixers: {
                include: {
                  mixerProduct: true,
                },
              },
            },
          },
        },
      });
  
    });
  }

  export async function rejectOrderRequest(
    input: RejectOrderRequestInput,
  ) {
    return await prisma.$transaction(async (tx) => {
  
      // ============================
      // Validate
      // ============================
  
      const {
        user,
        orderRequest,
      } = await rejectValidation({
        prisma: tx,
        orderRequestId: input.orderRequestId,
        approvedByUserId: input.approvedByUserId,
      });
  
      // ============================
      // Reject Order Request
      // ============================
  
      const rejectedOrderRequest =
        await tx.orderRequest.update({
          where: {
            id: orderRequest.id,
          },
          data: {
            status: "REJECTED",
  
            approvedByUserId: user.id,
  
            approvedAt: new Date(),
  
            note: input.reason
              ? orderRequest.note
                ? `${orderRequest.note}\n\nReject Reason: ${input.reason}`
                : `Reject Reason: ${input.reason}`
              : orderRequest.note,
          },
        });
  
      // ============================
      // Audit Log
      // ============================
  
      await tx.auditLog.create({
        data: {
          userId: user.id,
  
          action: "REJECT",
  
          entityType: "OrderRequest",
  
          entityId: orderRequest.id,
  
          targetName: orderRequest.id,
  
          description: "Cashier rejected order request.",
  
          oldValue: {
            status: "PENDING",
          } as Prisma.JsonObject,
  
          newValue: {
            status: "REJECTED",
            reason: input.reason ?? null,
          } as Prisma.JsonObject,
        },
      });
  
      // ============================
      // Return
      // ============================
  
      return await tx.orderRequest.findUnique({
        where: {
          id: rejectedOrderRequest.id,
        },
        include: {
          requestedBy: true,
  
          approvedBy: true,
  
          bill: true,
  
          items: {
            include: {
              product: true,
  
              mixers: {
                include: {
                  mixerProduct: true,
                },
              },
            },
          },
        },
      });
    });
  }

  export async function cancelOrderRequest(
    input: CancelOrderRequestInput,
  ) {
    return await prisma.$transaction(async (tx) => {
      // ============================
      // Validate
      // ============================
  
      const orderRequest = await cancelValidation({
        prisma: tx,
        orderRequestId: input.orderRequestId,
        requestedByUserId: input.requestedByUserId,
      });
  
      // ============================
      // Update Status
      // ============================
  
      const updatedOrderRequest =
        await tx.orderRequest.update({
          where: {
            id: orderRequest.id,
          },
          data: {
            status: "CANCELLED",
          },
        });
  
      // ============================
      // Audit Log
      // ============================
  
      await tx.auditLog.create({
        data: {
          userId: input.requestedByUserId,
  
          action: "UPDATE",
  
          entityType: "OrderRequest",
  
          entityId: orderRequest.id,
  
          targetName: orderRequest.id,
  
          description: "Staff cancelled order request.",
  
          oldValue: {
            status: "PENDING",
          },
  
          newValue: {
            status: "CANCELLED",
          },
        },
      });
  
      // ============================
      // Return
      // ============================
  
      return await tx.orderRequest.findUnique({
        where: {
          id: updatedOrderRequest.id,
        },
        include: {
          requestedBy: true,
  
          approvedBy: true,
  
          bill: true,
  
          items: {
            include: {
              product: true,
  
              mixers: {
                include: {
                  mixerProduct: true,
                },
              },
            },
          },
        },
      });
    });
  }
  
  

  