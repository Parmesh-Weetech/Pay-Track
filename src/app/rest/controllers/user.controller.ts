import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { LogAround } from "src/app/common/logger/log-around";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";
import { UserListResponse } from "../dtos/response/user-list-response.dto";

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
}