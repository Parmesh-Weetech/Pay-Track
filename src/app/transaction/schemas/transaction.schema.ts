import mongoose from "mongoose";
import { PaymentMethod } from "../types/payment-method";
import { TransactionStatus } from "../types/transaction-status";
import { TransactionHistorySchema } from "../../transaction_history/schemas/transaction_history.schema";
import { TransactionType } from "../types/transaction.interface";

const TransactionSchema = new mongoose.Schema<TransactionType>({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    transactionNumber: {
        type: String,
        required: true,
        unique: true
    },

    paymentMethod: {
        type: String,
        enum: PaymentMethod,
        required: true
    },

    transactionStatus: {
        type: String,
        enum: TransactionStatus,
        required: true,
        default: TransactionStatus.PENDING
    },

    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },

    history: [TransactionHistorySchema]

}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

TransactionSchema.index({ transactionNumber: 1 }, { unique: true });
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ orderId: 1 });
TransactionSchema.index({ transactionStatus: 1 });
TransactionSchema.index({ paymentMethod: 1 });

export const Transaction = mongoose.model<TransactionType>("Transaction", TransactionSchema);
