import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})
export class TransactionHistorySchema extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: "Transaction",
        required: true
    })
    transactionId: Types.ObjectId;

    @Prop({
        type: String,
        required: true
    })
    previousState: string;

    @Prop({
        type: String,
        required: true
    })
    newState: string;

    @Prop({
        type: String,
        required: true
    })
    changedBy: string;

    @Prop({
        type: Date,
        default: Date.now
    })
    changedAt: Date;

    @Prop({
        type: String,
        required: true
    })
    reason: string;
}

export const TransactionHistory = SchemaFactory.createForClass(TransactionHistorySchema);

TransactionHistory.index({ changedAt: -1 });
TransactionHistory.index({ changedBy: 1 });
TransactionHistory.index({ transactionId: 1 });
