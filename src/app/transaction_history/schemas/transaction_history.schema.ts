import mongoose from "mongoose";

export const TransactionHistorySchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },
    previousState: {
        type: String,
        required: true
    },

    newState: {
        type: String,
        required: true
    },

    changedBy: {
        type: String,
        required: true
    },

    changedAt: {
        type: Date,
        default: Date.now
    },

    reason: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

TransactionHistorySchema.index({ changedAt: -1 });
TransactionHistorySchema.index({ changedBy: 1 });
TransactionHistorySchema.index({ transactionId: 1 });

export const TransactionHistory = mongoose.model("TransactionHistory", TransactionHistorySchema);
