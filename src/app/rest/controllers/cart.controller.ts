import { Controller, Get, Param, Query } from "@nestjs/common";
import { LogAround } from "src/app/common/logger/log-around";
import { ListCartReqDTO } from "../dtos/request/cart-list-req.dto";
import { CartListResponse, CartResponse } from "../dtos/response/cart-res.dto";
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

    @Get(":cartId")
    @LogAround({
        ignoreReturn: true
    })
    async getCartById(
        @Param('cartId') cartId: string
    ): Promise<CartResponse> {
        return await this.cartService.getCartById(cartId);
    }

    @Get(':cartId/products')
    @LogAround({
        ignoreReturn: true
    })
    async getCartWithProducts(
        @Param('cartId') cartId: string
    ): Promise<CartResponse> {
        return await this.cartService.getCartWithProducts(cartId);
    }
}
