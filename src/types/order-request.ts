// src/types/order-request.ts

export interface CreateOrderRequestMixerInput {
    mixerProductId: string;
  }
  
  export interface CreateOrderRequestItemInput {
    productId: string;
  
    quantity: number;
  
    note?: string;
  
    isStaffDrink?: boolean;
  
    staffDrinkFee?: number;
  
    staffDrinkRecipient?: string;
  
    mixers?: CreateOrderRequestMixerInput[];
  }
  
  export interface CreateOrderRequestInput {
    billId: string;
  
    requestedByUserId: string;
  
    note?: string;
  
    items: CreateOrderRequestItemInput[];
  }
  
  export interface ApproveOrderRequestInput {
    orderRequestId: string;
  
    approvedByUserId: string;
  }
  
  export interface RejectOrderRequestInput {
    orderRequestId: string;
  
    approvedByUserId: string;
  
    reason?: string;
  }

  export interface CancelOrderRequestInput {
    orderRequestId: string;
  
    requestedByUserId: string;
  }