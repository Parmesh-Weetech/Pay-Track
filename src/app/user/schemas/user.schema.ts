import { Document } from "mongoose";
import { UserStatus } from "../types/user-status";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
    collection: 'users'
})
export class UserSchema extends Document {
    @Prop({
        name: 'firstName',
        required: true,
        type: String,
        minLength: 3
    })
    firstName: string;

    @Prop({
        name: 'lastName',
        required: true,
        lowercase: true,
        trim: true,
        type: String,
        minLength: 3
    })
    lastName: string;

    @Prop({
        required: true,
        unique: true,
        type: String,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    })
    email: string;

    @Prop({
        required: true,
        enum: UserStatus,
        type: String
    })
    status: string;
}

export const User = SchemaFactory.createForClass(UserSchema);
