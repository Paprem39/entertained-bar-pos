import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface IncreaseStockInput {
  productId: string;
  quantity: number;
  reason: "PURCHASE" | "RETURN" | "OTHER";
  userId?: string;
  referenceType?: string;
  referenceId?: string;
}

interface DecreaseStockInput {
  productId: string;
  quantity: number;
  reason: "SALE" | "DAMAGE" | "BORROW" | "OTHER";
  userId?: string;
  referenceType?: string;
  referenceId?: string;
}

interface AdjustStockInput {
  productId: string;
  quantity: number;
  reason: "COUNT" | "ADJUSTMENT";
  userId?: string;
}

async function getOrCreateStock(
  tx: Prisma.TransactionClient,
  productId: string,
) {
  const stock = await tx.stock.findUnique({
    where: {
      productId,
    },
  });

  if (stock) {
    return stock;
  }

  return await tx.stock.create({
    data: {
      productId,
      currentQty: 0,
    },
  });
}

export async function increaseStock(
  input: IncreaseStockInput,
  externalTx?: Prisma.TransactionClient,
) {
  const execute = async (tx: Prisma.TransactionClient) => {
    const product = await tx.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (input.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const stock = await getOrCreateStock(tx, input.productId);

    const beforeQty = stock.currentQty;
    const afterQty = beforeQty + input.quantity;

    await tx.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        currentQty: afterQty,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
    
        stockId: stock.id,
    
        productId: input.productId,
    
        userId: input.userId,
    
        movementType: "IN",
    
        reason: input.reason,
    
        quantity: input.quantity,
    
        beforeQty,
    
        afterQty,
    
        referenceType:
        input.referenceType,

        referenceId:
        input.referenceId,
    
      },
    });

    await tx.auditLog.create({
      data: {
        userId: input.userId,
        action: "CREATE",
        entityType: "Stock",
        entityId: stock.id,
        targetName: product.name,
        description: `Increase stock ${product.name}`,
        newValue: {
          quantity: input.quantity,
          beforeQty,
          afterQty,
          reason: input.reason,
        },
      },
    });

    return movement;
  };

  if (externalTx) {
    return await execute(externalTx);
  }

  return await prisma.$transaction(execute);
}

export async function decreaseStock(
  input: DecreaseStockInput,
  externalTx?: Prisma.TransactionClient,
) {
  const execute = async (tx: Prisma.TransactionClient) => {
    const product = await tx.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (input.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const stock = await tx.stock.findUnique({
      where: {
        productId: input.productId,
      },
    });

    if (!stock) {
      throw new Error("Stock not found");
    }

    const beforeQty = stock.currentQty;
    const afterQty = beforeQty - input.quantity;

    await tx.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        currentQty: afterQty,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        stockId: stock.id,
    
        productId: input.productId,
    
        userId: input.userId,
    
        movementType: "OUT",
    
        reason: input.reason,
    
        quantity: input.quantity,
    
        beforeQty,
    
        afterQty,
    
        referenceType:
          input.referenceType,
    
        referenceId:
          input.referenceId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: input.userId,
        action: "CREATE",
        entityType: "Stock",
        entityId: stock.id,
        targetName: product.name,
        description: `Decrease stock ${product.name}`,
        newValue: {
          quantity: input.quantity,
          beforeQty,
          afterQty,
          reason: input.reason,
        },
      },
    });

    return movement;
  };

  if (externalTx) {
    return await execute(externalTx);
  }

  return await prisma.$transaction(execute);
}

export async function adjustStock(
  input: AdjustStockInput,
  externalTx?: Prisma.TransactionClient,
) {
  const execute = async (tx: Prisma.TransactionClient) => {
    if (input.quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    const product = await tx.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const stock = await getOrCreateStock(tx, input.productId);

    const beforeQty = stock.currentQty;
    const afterQty = input.quantity;

    await tx.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        currentQty: afterQty,
        lastAdjustedAt: new Date(),
        updatedByUserId: input.userId,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        stockId: stock.id,
        productId: input.productId,
        userId: input.userId,
        movementType: "ADJUST",
        reason: input.reason,
        quantity: Math.abs(afterQty - beforeQty),
        beforeQty,
        afterQty,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: input.userId,
        action: "UPDATE",
        entityType: "Stock",
        entityId: stock.id,
        targetName: product.name,
        description: `Adjust stock ${product.name}`,
        newValue: {
          beforeQty,
          afterQty,
          reason: input.reason,
        },
      },
    });

    return movement;
  };

  if (externalTx) {
    return await execute(externalTx);
  }

  return await prisma.$transaction(execute);
}