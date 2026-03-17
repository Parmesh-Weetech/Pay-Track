import mongoose from "mongoose";
import { UserStatus } from "../src/app/user/types/user-status";
import { CartStatus } from "../src/app/cart/types/cart-status";
import { OrderStatus } from "../src/app/order/types/order-status";
import { PaymentStatus } from "../src/app/order/types/payment-status";
import { PaymentMethod } from "../src/app/transaction/types/payment-method";
import { TransactionStatus } from "../src/app/transaction/types/transaction-status";

export type SeedUser = {
    firstName: string;
    lastName: string;
    email: string;
    status: UserStatus;
};

export type SeedProduct = {
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
};

export type SeedOrderItem = {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    subTotal: number;
};

export type SeedOrder = {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    items: SeedOrderItem[];
    orderNumber: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    totalPrice: number;
};

export type SeedTransactionHistory = {
    transactionId: mongoose.Types.ObjectId;
    previousState: string;
    newState: string;
    changedBy: string;
    reason: string;
};

export type SeedTransaction = {
    _id: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    transactionNumber: string;
    paymentMethod: PaymentMethod;
    transactionStatus: TransactionStatus;
    totalAmount: number;
    history: SeedTransactionHistory[];
};

export type SeedCartItem = {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
};

export type SeedCart = {
    userId: mongoose.Types.ObjectId;
    items: SeedCartItem[];
    totalItem: number;
    totalPrice: number;
    status: CartStatus;
};
