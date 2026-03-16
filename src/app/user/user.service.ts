import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationFilter } from '../common/pagination/pagination-filter';
import { SORT_ORDER } from '../common/types/sort-type';
import { UserListResponse } from '../rest/dtos/response/user-list-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserSchema>
    ) { }

    async listUser(query: PaginationFilter): Promise<UserListResponse> {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

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

        const sortDirection = query.sortOrder === SORT_ORDER.ASC ? 1 : -1;

        const [items, total] = await Promise.all([
            this.userModel.aggregate([
                { $match: filter },
                {
                    $sort: { [sortField]: sortDirection }
                },
                { $skip: skip },
                { $limit: pageSize }
            ]),
            this.userModel.countDocuments(filter)
        ]);

        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            success: true,
            expired: false,
            message: "User Fetched Successful.",
            statusCode: 200,
            data: {
                items,
                total,
                page,
                pageSize,
                totalPages,
                hasNext,
                hasPrev
            }
        };
    }
}
