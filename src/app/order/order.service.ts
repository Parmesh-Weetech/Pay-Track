import { Injectable } from '@nestjs/common';
import { PaginationFilter } from '../common/pagination/pagination-filter';
import { OrderListResponse, OrderResponse } from '../rest/dtos/response/order-res.dto';
import { SORT_ORDER } from '../common/types/sort-type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';
import { operators } from '../user/types/operator-type';
import { ListOrderReqDTO } from '../rest/dtos/request/order-list-req.dto';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('Order')
        private readonly orderModel: Model<OrderSchema>
    ) { }
    async listOrders(
        query: ListOrderReqDTO
    ): Promise<OrderListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.orderStatus) {
            filter.orderStatus = query.orderStatus;
        }

        if (query.paymentStatus) {
            filter.paymentStatus = query.paymentStatus;
        }

        if (query.paymentMethod) {
            filter.paymentMethod = query.paymentMethod;
        }

        if (query.totalPrice) {
            const minTotalPrice = Number(query.totalPrice);
            if (Number.isFinite(minTotalPrice)) {
                filter.totalPrice = { $gt: minTotalPrice };
            }
        }

        if (query.totalPrice && query.operator && operators[query.operator]) {
            filter.totalPrice = {
                [operators[query.operator]]: Number(query.totalPrice)
            };
        }

        const allowedSortFields = new Set([
            'createdAt',
            'orderNumber',
            'orderStatus',
            'paymentStatus',
            'totalPrice',
            'userId'
        ]);

        const sortField = query.orderBy && allowedSortFields.has(query.orderBy)
            ? query.orderBy
            : 'createdAt';

        const sortDirection = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

        const [items, total] = await Promise.all([
            this.orderModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.orderModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "Orders Fetched Successfully.",
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

    async getOrderById(orderId: string): Promise<OrderResponse> {
        const order = await this.orderModel.findById(orderId);

        return {
            success: true,
            data: order ?? null,
            expired: false,
            message: "Order Fetched Successfully.",
            statusCode: 200
        };
    }

    async getOrderWithTransactions(
        orderId: string,
        paymentMethod: string,
        totalAmount: number,
        transactionStatus: string,
        operator: string
    ): Promise<OrderResponse> {
        const orderMatch: Record<string, unknown> = {};

        if (transactionStatus) {
            orderMatch.transactionStatus = transactionStatus;
        }

        if (paymentMethod) {
            orderMatch.paymentMethod = paymentMethod;
        }

        if (totalAmount) {
            const minTotalPrice = Number(totalAmount);
            if (Number.isFinite(minTotalPrice)) {
                orderMatch.totalAmount = { $gt: minTotalPrice };
            }
        }

        if (totalAmount && operator && operators[operator]) {
            orderMatch.totalAmount = {
                [operators[operator]]: Number(totalAmount)
            };
        }

        const orderPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(orderId) } },
            {
                $lookup: {
                    from: 'transactions',
                    let: { orderId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...orderMatch,
                                $expr: {
                                    $eq: [
                                        "$orderId",
                                        "$$orderId"
                                    ]
                                }
                            }
                        }],
                    as: 'transaction'
                }
            },
            { $limit: 1 }
        ];

        const [user] = await this.orderModel.aggregate(orderPipeline);

        return {
            success: true,
            data: user ?? null,
            expired: false,
            message: "Order with transactions fetched successfully.",
            statusCode: 200
        }
    }

    async getOrdersWithProducts(
        orderId: string,
        search: string,
        price: number,
        operator: string,
        category: string,
        isAvailable: boolean
    ): Promise<OrderResponse> {
        const orderMatch: Record<string, unknown> = {};

        if (search) {
            orderMatch.search = search;
        }

        if (category) {
            orderMatch.category = category;
        }

        if (price) {
            const minTotalPrice = Number(price);
            if (Number.isFinite(minTotalPrice)) {
                orderMatch.price = { $gt: minTotalPrice };
            }
        }

        if (price && operator && operators[operator]) {
            orderMatch.price = {
                [operators[operator]]: Number(price)
            };
        }

        if (isAvailable) {
            orderMatch.isAvailable = isAvailable;
        }

        const userPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(orderId) } },
            {
                $lookup: {
                    from: 'products',
                    let: { productId: "$items.productId" },
                    pipeline: [
                        {
                            $match: {
                                ...orderMatch,
                                $expr: {
                                    $in: [
                                        "$_id",
                                        "$$productId"
                                    ]
                                }
                            }
                        }],
                    as: 'products'
                }
            },
            { $limit: 1 }
        ];

        const [user] = await this.orderModel.aggregate(userPipeline);

        return {
            success: true,
            data: user ?? null,
            expired: false,
            message: "Order with products fetched successfully.",
            statusCode: 200
        }
    }
}
