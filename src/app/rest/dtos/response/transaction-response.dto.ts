import { ApiProperty } from "@nestjs/swagger";
import { ListResponse } from "../list.dto";
import { APIResponse } from "../../../common/helper/response";
import { TransactionSchema } from "src/app/transaction/schemas/transaction.schema";

export class TransactionListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse;
}

export class TransactionResponse extends APIResponse {
    @ApiProperty({ type: () => TransactionSchema })
    data: TransactionSchema
}