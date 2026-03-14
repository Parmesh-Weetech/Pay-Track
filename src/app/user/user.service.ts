import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserSchema>
    ) { }

    async listUser() {
        return this.userModel.find().limit(10);
    }
}
