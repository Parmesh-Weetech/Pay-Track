import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { TransactionHistorySchema } from './schemas/transaction_history.schema';
import { ListTransactionHistoryReqDTO } from '../rest/dtos/request/transaction-history-list-req.dto';
import { TransactionHistoryListResponse, TransactionHistoryResponse } from '../rest/dtos/response/transaction-history-res.dto';
import { SORT_ORDER } from '../common/types/sort-type';

@Injectable()
export class TransactionHistoryService {
    constructor(
        @InjectModel('TransactionHistory')
        private readonly transactionHistoryModel: Model<TransactionHistorySchema>
    ) { }

    async listTransactionHistories(query: ListTransactionHistoryReqDTO): Promise<TransactionHistoryListResponse> {
        const skip = (query.page - 1) * query.pageSize;

        const filter: Record<string, unknown> = {};

        if (query.previousState) {
            filter.previousState = query.previousState;
        }

        if (query.newState) {
            filter.newState = query.newState;
        }

        if (query.changedBy) {
            filter.changedBy = query.changedBy;
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
            this.transactionHistoryModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: query.pageSize }
            ]),
            this.transactionHistoryModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
        const hasNext = query.page < totalPages;
        const hasPrev = query.page > 1;

        return {
            success: true,
            expired: false,
            message: "Transaction History Fetched Successfully.",
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

    async getTransactionHistoryDetails(
        historyId: string
    ): Promise<TransactionHistoryResponse> {
        const transaction = await this.transactionHistoryModel.findById(historyId);

        return {
            success: true,
            expired: false,
            message: "Transaction History Fetched Successfully.",
            statusCode: 200,
            data: transaction ?? null
        };
    }

    async getTransactionHistoryWithTransaction(
        historyId: string
    ): Promise<TransactionHistoryResponse> {
        const transactionPipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(historyId) } },
            {
                $lookup: {
                    from: 'transactions',
                    let: { historyId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$$historyId",
                                        "$history._id"
                                    ]
                                }
                            }
                        }],
                    as: 'transaction'
                }
            },
            { $limit: 1 }
        ];

        const [history] = await this.transactionHistoryModel.aggregate(transactionPipeline);

        return {
            success: true,
            statusCode: 200,
            message: "Transaction History Fetched Successfully with Transaction.",
            data: history,
            expired: false
        }
    }
}
