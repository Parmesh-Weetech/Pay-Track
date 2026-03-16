import { Injectable } from '@nestjs/common';
import { ListTransactionReqDTO } from '../rest/dtos/request/transaction-list-req.dto';
import { TransactionListResponse } from '../rest/dtos/response/transaction-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { SORT_ORDER } from '../common/types/sort-type';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel('Transaction')
        private readonly transactionModel: Model<TransactionSchema>
    ) { }

    async listTransactions(query: ListTransactionReqDTO): Promise<TransactionListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.paymentMethod) {
            filter.paymentMethod = query.paymentMethod;
        }

        const sortField = query.orderBy ? query.orderBy : 'createdAt';

        const sortDirection = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

        const [items, total] = await Promise.all([
            this.transactionModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.transactionModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "Transactions Fetched Successfully.",
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
