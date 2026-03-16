import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
})
export class ProductSchema extends Document {
    @Prop({
        required: true,
        type: String
    })
    name: string;

    @Prop({
        required: false,
        type: String
    })
    description: string;

    @Prop({
        required: true,
        type: Number
    })
    price: number;

    @Prop({
        required: true,
        type: String
    })
    category: string;

    @Prop({
        required: true,
        default: true,
        type: Boolean
    })
    isAvailable: boolean;
}

export const Product = SchemaFactory.createForClass(ProductSchema);

Product.index({ category: 1 });
Product.index({ price: 1 });
Product.index({ name: 1 });
