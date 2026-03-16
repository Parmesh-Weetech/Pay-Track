import { ApiProperty, ApiRequestTimeoutResponse } from "@nestjs/swagger";
import { APIResponse } from "src/app/common/helper/response";
import { UserList } from "../user-list.dto";
import { UserSchema } from "../../../user/schemas/user.schema";

export class UserListResponse extends APIResponse {
    @ApiProperty({ type: () => UserList })
    data: UserList
}

export class UserResponse extends APIResponse {
    @ApiProperty({ type: () => UserSchema })
    data: UserSchema
}