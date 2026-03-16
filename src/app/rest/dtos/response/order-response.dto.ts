import { APIResponse } from "../../../common/helper/response"
import { OrderList } from "../order-list.dto"
import { OrderSchema } from "../../../order/schemas/order.schema"
import { ApiProperty } from "@nestjs/swagger"

export class OrderListResponse extends APIResponse {
    @ApiProperty({ type: () => OrderList })
    data: OrderList
}

export class OrderResponse extends APIResponse {
    @ApiProperty({ type: () => OrderSchema })
    data: OrderSchema
}