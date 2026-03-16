import { Controller, Get, Query } from "@nestjs/common";
import { LogAround } from "src/app/common/logger/log-around";
import { ListCartReqDTO } from "../dtos/request/cart-list-req.dto";
import { CartListResponse } from "../dtos/response/cart-response.dto";
import { CartService } from "src/app/cart/cart.service";

@Controller({ path: 'cart' })
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listCart(
        @Query() query: ListCartReqDTO
    ): Promise<CartListResponse> {
        return await this.cartService.listCart(query);
    }
}