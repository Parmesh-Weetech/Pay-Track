import { ApiProperty } from "@nestjs/swagger";
import { APIResponse } from "src/app/common/helper/response";
import { UserSchema } from "../../../user/schemas/user.schema";
import { ListResponse } from "../list.dto";

export class UserListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse
}

export class UserResponse extends APIResponse {
    @ApiProperty({ type: () => UserSchema })
    data: UserSchema | null;
}