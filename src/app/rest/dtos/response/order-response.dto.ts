import { APIResponse } from "../../../common/helper/response"
import { OrderSchema } from "../../../order/schemas/order.schema"
import { ApiProperty } from "@nestjs/swagger"
import { ListResponse } from "../list.dto"

export class OrderListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse
}

export class OrderResponse extends APIResponse {
    @ApiProperty({ type: () => OrderSchema })
    data: OrderSchema
}