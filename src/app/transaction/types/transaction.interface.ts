import mongoose from "mongoose";

export interface TransactionType {
    orderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    transactionNumber: string;
    paymentMethod: string;
    transactionStatus: string;
    totalAmount: number;
    history: {
        previousState: string;
        newState: string;
        changedBy: string;
        reason?: string;
        changedAt: Date;
    }[];
}