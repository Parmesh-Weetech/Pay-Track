import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CartStatus } from "../types/cart-status";

@Schema({ _id: false })
export class CartItemSchema {
    @Prop({
        type: Types.ObjectId,
        ref: "Product",
        required: true
    })
    productId: Types.ObjectId;

    @Prop({
        type: Number,
        default: 1
    })
    quantity: number;

    @Prop({
        type: Number
    })
    price: number;
}

export const CartItem = SchemaFactory.createForClass(CartItemSchema);

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})
export class CartSchema extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true
    })
    userId: Types.ObjectId;

    @Prop({
        type: [CartItem]
    })
    items: CartItemSchema[];

    @Prop({
        required: true,
        default: 0,
        type: Number
    })
    totalItem: number;

    @Prop({
        required: true,
        default: 0,
        type: Number
    })
    totalPrice: number;

    @Prop({
        required: true,
        enum: CartStatus,
        type: String
    })
    status: CartStatus;
}

export const Cart = SchemaFactory.createForClass(CartSchema);

Cart.index({ userId: 1 });
Cart.index({ status: 1 });
Cart.index({ userId: 1, status: 1 });
