import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { PaginationFilter } from '../common/pagination/pagination-filter';
import { SORT_ORDER } from '../common/types/sort-type';
import { UserListResponse, UserResponse } from '../rest/dtos/response/user-res.dto';
import { UserSummaryResponse } from '../rest/dtos/response/user-summary-res.dto';
import { operators } from './types/operator-type';

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

        const allowedSortFields = new Set([
            'createdAt',
            'firstName',
            'lastName',
            'email',
            'status'
        ]);

        const sortField = query.orderBy && allowedSortFields.has(query.orderBy)
            ? query.orderBy
            : 'createdAt';

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
            message: "Users Fetched Successfully.",
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

    async getUserById(userId: string): Promise<UserResponse> {
        const user = await this.userModel.findById(userId);

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
        totalPrice: number,
        operator: string
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

        if (totalPrice && operator && operators[operator]) {
            cartMatch.totalPrice = {
                [operators[operator]]: Number(totalPrice)
            };
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

    async getUserWithOrderDetails(
        userId: string,
        orderStatus: string,
        paymentStatus: string,
        totalPrice: number,
        operator: string
    ): Promise<UserResponse> {
        const orderMatch: Record<string, unknown> = {};

        if (orderStatus) {
            orderMatch.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            orderMatch.paymentStatus = paymentStatus;
        }

        if (totalPrice) {
            const minTotalPrice = Number(totalPrice);
            if (Number.isFinite(minTotalPrice)) {
                orderMatch.totalPrice = { $gt: minTotalPrice };
            }
        }

        if (totalPrice && operator && operators[operator]) {
            orderMatch.totalPrice = {
                [operators[operator]]: Number(totalPrice)
            };
        }

        const userPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'orders',
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...orderMatch,
                                $expr: {
                                    $eq: [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            }
                        }],
                    as: 'order'
                }
            },
            { $limit: 1 }
        ];

        const [user] = await this.userModel.aggregate(userPipeline);

        return {
            success: true,
            data: user ?? null,
            expired: false,
            message: "User with orders fetched successfully.",
            statusCode: 200
        }
    }

    async getUserWithTransactionDetails(
        userId: string,
        paymentMethod: string,
        totalAmount: number,
        transactionStatus: string,
        operator: string
    ): Promise<UserResponse> {
        const transactionMatch: Record<string, unknown> = {};

        if (transactionStatus) {
            transactionMatch.transactionStatus = transactionStatus;
        }

        if (paymentMethod) {
            transactionMatch.paymentMethod = paymentMethod;
        }

        if (totalAmount) {
            const minTotalPrice = Number(totalAmount);
            if (Number.isFinite(minTotalPrice)) {
                transactionMatch.totalAmount = { $gt: minTotalPrice };
            }
        }

        if (totalAmount && operator && operators[operator]) {
            transactionMatch.totalPrice = {
                [operators[operator]]: Number(totalAmount)
            };
        }

        const userPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'transactions',
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...transactionMatch,
                                $expr: {
                                    $eq: [
                                        "$userId",
                                        "$$userId"
                                    ]
                                }
                            }
                        }],
                    as: 'transaction'
                }
            },
            { $limit: 1 }
        ];

        const [user] = await this.userModel.aggregate(userPipeline);

        return {
            success: true,
            data: user ?? null,
            expired: false,
            message: "User with transactions fetched successfully.",
            statusCode: 200
        }
    }

    async getSummary(userId: string): Promise<UserSummaryResponse> {
        const userPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'carts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'carts'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'orders'
                }
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'transactions'
                }
            },
            {
                $addFields: {
                    cartCount: { $size: '$carts' },
                    orderCount: { $size: '$orders' },
                    transactionCount: { $size: '$transactions' },
                    totalSpent: { $sum: '$transactions.totalAmount' }
                }
            },
            {
                $project: {
                    carts: 0,
                    orders: 0,
                    transactions: 0
                }
            },
            { $limit: 1 }
        ];

        const [summary] = await this.userModel.aggregate(userPipeline);

        if (!summary) {
            return {
                success: true,
                expired: false,
                message: "User summary fetched successfully.",
                statusCode: 200,
                data: null
            };
        }

        const {
            cartCount = 0,
            orderCount = 0,
            transactionCount = 0,
            totalSpent = 0,
            ...user
        } = summary;

        return {
            success: true,
            expired: false,
            message: "User summary fetched successfully.",
            statusCode: 200,
            data: {
                user,
                cartCount,
                orderCount,
                transactionCount,
                totalSpent
            }
        };
    }
}
