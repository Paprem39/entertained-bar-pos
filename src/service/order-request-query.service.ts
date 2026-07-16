import { prisma } from "@/lib/prisma";

export async function getPendingOrderRequests() {
    return await prisma.orderRequest.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        requestedBy: true,
  
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
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  export async function getOrderRequestById(
    orderRequestId: string,
  ) {
    return await prisma.orderRequest.findUnique({
      where: {
        id: orderRequestId,
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
  }

  export async function getMyPendingOrderRequests(
    requestedByUserId: string,
  ) {
    return await prisma.orderRequest.findMany({
      where: {
        requestedByUserId,
        status: "PENDING",
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  export async function getMyOrderHistory(
    requestedByUserId: string,
  ) {
    return await prisma.orderRequest.findMany({
      where: {
        requestedByUserId,
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  export async function getApprovedOrderRequests() {
    return await prisma.orderRequest.findMany({
      where: {
        status: "APPROVED",
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
      orderBy: {
        approvedAt: "desc",
      },
    });
  }

  export async function getPendingOrderRequestCount() {
    return await prisma.orderRequest.count({
      where: {
        status: "PENDING",
      },
    });
  }
  
  export async function getPendingOrderRequestsByBill(
    billId: string,
  ) {
    return await prisma.orderRequest.findMany({
      where: {
        billId,
        status: "PENDING",
      },
      include: {
        requestedBy: true,
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
      orderBy: {
        createdAt: "asc",
      },
    });
  }
  
  export async function getPendingOrderRequestsByStaff(
    requestedByUserId: string,
  ) {
    return await prisma.orderRequest.findMany({
      where: {
        requestedByUserId,
        status: "PENDING",
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  
  export async function getOrderRequestsByBill(
    billId: string,
  ) {
    return await prisma.orderRequest.findMany({
      where: {
        billId,
      },
      include: {
        requestedBy: true,
        approvedBy: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });
  }
