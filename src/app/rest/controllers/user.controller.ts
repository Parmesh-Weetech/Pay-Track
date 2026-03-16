import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { LogAround } from "src/app/common/logger/log-around";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";
import { UserListResponse, UserResponse } from "../dtos/response/user-response.dto";

@Controller({ path: "user" })
export class UserController {

    constructor(private readonly userService: UserService) { }
    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listUser(
        @Query() query: PaginationFilter
    ): Promise<UserListResponse> {
        return await this.userService.listUser(query);
    }

    @Get(":userId")
    @LogAround({
        ignoreReturn: true
    })
    async getUserById(
        @Param('userId') userId: string
    ): Promise<UserResponse> {
        return await this.userService.getUserById(userId);
    }

    @Get(":userId/cart")
    @LogAround({
        ignoreReturn: true
    })
    async getUserWithCartDetails(
        @Param('userId') userId: string,
        @Query('status') cartStatus: string,
        @Query('totalPrice') totalPrice: number,
        @Query('operator') operator: string
    ): Promise<UserResponse> {
        return await this.userService.getUserWithCartDetails(
            userId,
            cartStatus,
            totalPrice,
            operator
        )
    }

    @Get(":userId/orders")
    @LogAround({
        ignoreReturn: true
    })
    async getUserWithOrderDetails(
        @Param('userId') userId: string,
        @Query('orderStatus') orderStatus: string,
        @Query('paymentStatus') paymentStatus: string,
        @Query('totalPrice') totalPrice: number,
        @Query('operator') operator: string
    ): Promise<UserResponse> {
        return await this.userService.getUserWithOrderDetails(
            userId,
            orderStatus,
            paymentStatus,
            totalPrice,
            operator
        )
    }

    @Get(':userId/transactions')
    @LogAround({
        ignoreReturn: true
    })
    async getUserWithTransactionDetails(
        @Param('userId') userId: string,
        @Query('paymentMethod') paymentMethod: string,
        @Query('totalAmount') totalAmount: number,
        @Query('transactionStatus') transactionStatus: string,
        @Query('operator') operator: string
    ): Promise<UserResponse> {
        return await this.userService.getUserWithTransactionDetails(
            userId,
            paymentMethod,
            totalAmount,
            transactionStatus,
            operator
        )
    }
}
