import { APIResponse } from "../../../common/helper/response";
import { ApiProperty } from "@nestjs/swagger";
import { ListResponse } from "../list.dto";
import { CartSchema } from "src/app/cart/schemas/cart.schema";
import { TransactionHistorySchema } from "src/app/transaction_history/schemas/transaction_history.schema";

export class TransactionHistoryListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse
}

export class TransactionHistoryResponse extends APIResponse {
    @ApiProperty({ type: () => TransactionHistorySchema })
    data: TransactionHistorySchema | null;
}