import { ApiProperty } from "@nestjs/swagger";
import { APIResponse } from "src/app/common/helper/response";
import { UserList } from "../user-list.dto";

export class UserListResponse extends APIResponse {
    @ApiProperty({ type: () => UserList })
    data: UserList
}