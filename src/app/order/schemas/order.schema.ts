import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { OrderStatus } from "../types/order-status";
import { PaymentStatus } from "../types/payment-status";

@Schema({ _id: false })
export class OrderItemSchema {
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
        type: Number,
        required: true
    })
    price: number;

    @Prop({
        type: Number
    })
    subTotal: number;
}

export const OrderItem = SchemaFactory.createForClass(OrderItemSchema);

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})
export class OrderSchema extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: "User",
        required: true
    })
    userId: Types.ObjectId;

    @Prop({
        type: [OrderItem]
    })
    items: OrderItemSchema[];

    @Prop({
        required: true,
        unique: true,
        type: String
    })
    orderNumber: string;

    @Prop({
        required: true,
        enum: OrderStatus,
        type: String,
        default: OrderStatus.PENDING
    })
    orderStatus: OrderStatus;

    @Prop({
        required: true,
        default: 0,
        type: Number
    })
    totalPrice: number;

    @Prop({
        required: true,
        enum: PaymentStatus,
        type: String
    })
    paymentStatus: PaymentStatus;
}

export const Order = SchemaFactory.createForClass(OrderSchema);

Order.index({ userId: 1, createdAt: -1 });
Order.index({ userId: 1, orderStatus: 1 });
