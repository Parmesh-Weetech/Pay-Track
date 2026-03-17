import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrderListResponse, OrderResponse } from "../dtos/response/order-res.dto";
import { OrderService } from "../../order/order.service";
import { LogAround } from "src/app/common/logger/log-around";
import { ListOrderReqDTO } from "../dtos/request/order-list-req.dto";

@Controller({ path: 'order' })
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listOrders(
        @Query() query: ListOrderReqDTO
    ): Promise<OrderListResponse> {
        return await this.orderService.listOrders(query);
    }

    @Get(':orderId')
    @LogAround({
        ignoreReturn: true
    })
    async getOrderById(
        @Param('orderId') orderId: string
    ): Promise<OrderResponse> {
        return await this.orderService.getOrderById(orderId);
    }

    @Get(':orderId/transactions')
    @LogAround({
        ignoreReturn: true
    })
    async getOrdersWithTransactions(
        @Param('orderId') orderId: string,
        @Query('paymentMethod') paymentMethod: string,
        @Query('totalAmount') totalAmount: number,
        @Query('transactionStatus') transactionStatus: string,
        @Query('operator') operator: string
    ): Promise<OrderResponse> {
        return await this.orderService.getOrderWithTransactions(
            orderId,
            paymentMethod,
            totalAmount,
            transactionStatus,
            operator
        )
    }

    @Get(':orderId/products')
    @LogAround({
        ignoreReturn: true
    })
    async getOrdersWithProducts(
        @Param('orderId') orderId: string,
        @Query('search') search: string,
        @Query('price') price: number,
        @Query('operator') operator: string,
        @Query('category') category: string,
        @Query('isAvailable') isAvailable: string
    ): Promise<OrderResponse> {
        return await this.orderService.getOrdersWithProducts(
            orderId,
            search,
            price,
            operator,
            category,
            isAvailable === 'true'
        )
    }
}
