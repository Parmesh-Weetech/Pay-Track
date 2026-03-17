import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { APIResponse } from "src/app/common/helper/response";
import { UserSchema } from "src/app/user/schemas/user.schema";

export class UserSummaryData {
    @ApiProperty({ type: () => UserSchema })
    user: UserSchema;

    @ApiProperty({ example: 0 })
    cartCount: number;

    @ApiProperty({ example: 0 })
    orderCount: number;

    @ApiProperty({ example: 0 })
    transactionCount: number;

    @ApiPropertyOptional({ example: 0 })
    totalSpent?: number;
}

export class UserSummaryResponse extends APIResponse {
    @ApiProperty({ type: () => UserSummaryData })
    data: UserSummaryData | null;
}
