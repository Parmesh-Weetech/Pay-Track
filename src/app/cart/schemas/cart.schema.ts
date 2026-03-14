import mongoose from "mongoose";
import { CartStatus } from "../types/cart-status";

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    price: Number
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [CartItemSchema],

    totalItem: {
        type: Number,
        required: true,
        default: 0
    },

    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },

    status: {
        type: String,
        required: true,
        enum: CartStatus
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

CartSchema.index({ userId: 1 });
CartSchema.index({ status: 1 });
CartSchema.index({ userId: 1, status: 1 });

export const Cart = mongoose.model("Cart", CartSchema);
