import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PaymentMethod } from "../types/payment-method";
import { TransactionStatus } from "../types/transaction-status";
import { TransactionHistory, TransactionHistorySchema } from "../../transaction_history/schemas/transaction_history.schema";

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})
export class TransactionSchema extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: "Order",
        required: true
    })
    orderId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true
    })
    userId: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    transactionNumber: string;

    @Prop({
        type: String,
        enum: PaymentMethod,
        required: true
    })
    paymentMethod: PaymentMethod;

    @Prop({
        type: String,
        enum: TransactionStatus,
        required: true,
        default: TransactionStatus.PENDING
    })
    transactionStatus: TransactionStatus;

    @Prop({
        type: Number,
        required: true,
        default: 0
    })
    totalAmount: number;

    @Prop({
        type: [TransactionHistory]
    })
    history: TransactionHistorySchema[];
}

export const Transaction = SchemaFactory.createForClass(TransactionSchema);

Transaction.index({ transactionNumber: 1 }, { unique: true });
Transaction.index({ userId: 1, createdAt: -1 });
Transaction.index({ orderId: 1 });
Transaction.index({ transactionStatus: 1 });
Transaction.index({ paymentMethod: 1 });
