import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { PaginationFilter } from '../common/pagination/pagination-filter';
import { SORT_ORDER } from '../common/types/sort-type';
import { UserListResponse, UserResponse } from '../rest/dtos/response/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserSchema>
    ) { }

    async listUser(query: PaginationFilter): Promise<UserListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex }
            ];
        }

        const sortField = query.orderBy ? query.orderBy : 'createdAt';

        const sortDirection = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

        const [items, total] = await Promise.all([
            this.userModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.userModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "User Fetched Successful.",
            statusCode: 200,
            data: {
                items,
                total,
                page: query.page,
                pageSize: query.pageSize,
                totalPages,
                hasNext,
                hasPrev
            }
        };
    }

    async getUserDetails(
        userId: string,
        cart: boolean,
        orders: boolean,
        transactions: boolean
    ): Promise<UserResponse> {
        const pipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(userId) } }
        ];

        if (cart) {
            pipeline.push({
                $lookup: {
                    from: "carts",
                    localField: "_id",
                    foreignField: "userId",
                    as: "cart"
                }
            });
        }

        if (orders) {
            pipeline.push({
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "userId",
                    as: "orders"
                }
            });
        }

        if (transactions) {
            pipeline.push({
                $lookup: {
                    from: "transactions",
                    localField: "_id",
                    foreignField: "userId",
                    as: "transactions"
                }
            });
        }

        pipeline.push({ $limit: 1 });

        const [user] = await this.userModel.aggregate(pipeline);

        return {
            success: true,
            expired: false,
            message: "User Fetched Successful.",
            statusCode: 200,
            data: user ?? null
        };
    }

    async getUserWithCartDetails(
        userId: string,
        cartStatus: string,
        totalPrice: number
    ): Promise<UserResponse> {
        const cartMatch: Record<string, unknown> = {};

        if (cartStatus) {
            cartMatch.status = cartStatus;
        }

        if (totalPrice) {
            const minTotalPrice = Number(totalPrice);
            if (Number.isFinite(minTotalPrice)) {
                cartMatch.totalPrice = { $gt: minTotalPrice };
            }
        }

        const userPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'carts',
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...cartMatch,
                                $expr: {
                                    $eq: [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            }
                        }],
                    as: 'cart'
                }
            },
            { $limit: 1 }
        ];

        const [user] = await this.userModel.aggregate(userPipeline);

        return {
            success: true,
            data: user ?? null,
            expired: false,
            message: "User with cart fetched successfully.",
            statusCode: 200
        }
    }
}
