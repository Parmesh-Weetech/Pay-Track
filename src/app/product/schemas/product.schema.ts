import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false,
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },
    
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ isAvailable: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 1 });

export const Product = mongoose.model("Product", ProductSchema);
