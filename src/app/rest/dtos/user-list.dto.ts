import { UserSchema } from '../../user/schemas/user.schema'

export class UserList {
    items: UserSchema[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}