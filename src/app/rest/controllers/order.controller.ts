import { Controller, Get, Query } from "@nestjs/common";
import { PaginationFilter } from "../../common/pagination/pagination-filter";
import { OrderListResponse } from "../dtos/response/order-response.dto";
import { OrderService } from "../../order/order.service";

@Controller({ path: 'order' })
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Get()
    async listOrders(
        @Query() query: PaginationFilter
    ): Promise<OrderListResponse> {
        return await this.orderService.listOrders(query)
    }
}