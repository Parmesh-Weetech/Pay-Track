import { Injectable } from '@nestjs/common';
import { ListProductReqDTO } from '../rest/dtos/request/product-list-req.dto';
import { ProductListResponse, ProductResponse } from '../rest/dtos/response/product-res.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { ProductSchema } from './schemas/product.schema';
import { operators } from '../user/types/operator-type';
import { SORT_ORDER } from '../common/types/sort-type';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('Product')
        private readonly productModel: Model<ProductSchema>
    ) { }
    async listProducts(query: ListProductReqDTO): Promise<ProductListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.category) {
            filter.category = query.category;
        }

        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex }
            ];
        }

        if (query.price) {
            const minTotalPrice = Number(query.price);
            if (Number.isFinite(minTotalPrice)) {
                filter.totalPrice = { $gt: minTotalPrice };
            }
        }

        if (query.price && query.operator && operators[query.operator]) {
            filter.totalPrice = {
                [operators[query.operator]]: Number(query.price)
            };
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
            this.productModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.productModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "Products Fetched Successfully.",
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

    async getProductDetails(productId: string): Promise<ProductResponse> {
        const cart = await this.productModel.findById(productId);

        return {
            success: true,
            expired: false,
            message: "Product Fetched Successfully.",
            statusCode: 200,
            data: cart ?? null
        };
    }

    async getProductsWithOrder(
        productId: string,
        orderStatus: string,
        paymentStatus: string,
        totalPrice: number,
        operator: string
    ): Promise<ProductResponse> {
        const productMatch: Record<string, unknown> = {};

        if (orderStatus) {
            productMatch.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            productMatch.paymentStatus = paymentStatus;
        }

        if (totalPrice) {
            const minTotalPrice = Number(totalPrice);
            if (Number.isFinite(minTotalPrice)) {
                productMatch.totalPrice = { $gt: minTotalPrice };
            }
        }

        if (totalPrice && operator && operators[operator]) {
            productMatch.totalPrice = {
                [operators[operator]]: Number(totalPrice)
            };
        }

        const productPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(productId) } },
            {
                $lookup: {
                    from: 'orders',
                    as: 'orders',
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...productMatch,
                                $expr: {
                                    $in: [
                                        "$$productId",
                                        "$items.productId"
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $limit: 1
            }
        ];

        const [product] = await this.productModel.aggregate(productPipeline);

        return {
            success: true,
            data: product ?? null,
            expired: false,
            message: "Product with order fetched successfully.",
            statusCode: 200
        }
    }

    async getProductsWithCarts(
        productId: string,
        totalPrice: number,
        operator: string,
        status: string
    ): Promise<ProductResponse> {
        const productMatch: Record<string, unknown> = {};

        if (status) {
            productMatch.status = status;
        }

        if (totalPrice) {
            const minTotalPrice = Number(totalPrice);
            if (Number.isFinite(minTotalPrice)) {
                productMatch.totalPrice = { $gt: minTotalPrice };
            }
        }

        if (totalPrice && operator && operators[operator]) {
            productMatch.totalPrice = {
                [operators[operator]]: Number(totalPrice)
            };
        }

        const productPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(productId) } },
            {
                $lookup: {
                    from: 'carts',
                    as: 'carts',
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                ...productMatch,
                                $expr: {
                                    $in: [
                                        "$$productId",
                                        "$items.productId"
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $limit: 1
            }
        ];

        const [product] = await this.productModel.aggregate(productPipeline);

        return {
            success: true,
            data: product ?? null,
            expired: false,
            message: "Product with cart fetched successfully.",
            statusCode: 200
        }
    }
}
