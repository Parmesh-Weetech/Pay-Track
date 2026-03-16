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
    async getUserDetails(
        @Param('userId') userId: string,
        @Query('cart') cart?: string,
        @Query('orders') orders?: string,
        @Query('transactions') transactions?: string,
    ): Promise<UserResponse> {
        return await this.userService.getUserDetails(
            userId,
            cart === 'true',
            orders === 'true',
            transactions === 'true'
        );
    }
}
