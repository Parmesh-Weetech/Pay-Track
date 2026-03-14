import mongoose from "mongoose";
import { OrderStatus } from "../types/order-status";
import { PaymentStatus } from "../types/payment-status";

const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    price: Number,

    subTotal: Number
})

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [OrderItemSchema],

    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    orderStatus: {
        type: String,
        enum: OrderStatus,
        required: true,
        default: OrderStatus.PENDING
    },

    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    
    paymentStatus: {
        type: String,
        required: true,
        enum: PaymentStatus
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model("Order", OrderSchema);
