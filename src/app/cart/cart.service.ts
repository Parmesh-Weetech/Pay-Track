import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { ListCartReqDTO } from '../rest/dtos/request/cart-list-req.dto';
import { CartListResponse, CartResponse } from '../rest/dtos/response/cart-res.dto';
import { operators } from '../user/types/operator-type';
import { SORT_ORDER } from '../common/types/sort-type';

@Injectable()
export class CartService {
    constructor(
        @InjectModel('Cart')
        private readonly cartModel: Model<CartSchema>
    ) { }

    async listCart(
        query: ListCartReqDTO
    ): Promise<CartListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.userId) {
            filter.userId = new Types.ObjectId(query.userId);
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
            'totalPrice',
            'totalItem',
            'status'
        ]);

        const sortField = query.orderBy && allowedSortFields.has(query.orderBy)
            ? query.orderBy
            : 'createdAt';

        const sortDirection = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

        const [items, total] = await Promise.all([
            this.cartModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.cartModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "Cart Fetched Successfully.",
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

    async getCartById(cartId: string): Promise<CartResponse> {
        const cart = await this.cartModel.findById(cartId);

        return {
            success: true,
            expired: false,
            message: "Cart Fetched Successfully.",
            statusCode: 200,
            data: cart ?? null
        };
    }

    async getCartWithProducts(cartId: string): Promise<CartResponse> {
        const cartPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(cartId) } },
            {
                $lookup: {
                    from: 'products',
                    let: { productIds: "$items.productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        "$$productIds"
                                    ]
                                }
                            }
                        }],
                    as: 'products'
                }
            },
            { $limit: 1 }
        ];

        const [history] = await this.cartModel.aggregate(cartPipeline);

        return {
            success: true,
            statusCode: 200,
            message: "Cart Fetched With Products Successfully.",
            data: history,
            expired: false
        }
    }
}
