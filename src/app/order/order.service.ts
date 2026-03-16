import { Injectable } from '@nestjs/common';
import { PaginationFilter } from '../common/pagination/pagination-filter';
import { OrderListResponse } from '../rest/dtos/response/order-response.dto';
import { SORT_ORDER } from '../common/types/sort-type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel('Order')
        private readonly orderModel: Model<OrderSchema>
    ) { }
    async listOrders(
        query: PaginationFilter
    ): Promise<OrderListResponse> {
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
}
