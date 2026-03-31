import { Controller, Get, Param, Query } from "@nestjs/common";
import { LogAround } from "src/app/common/logger/log-around";
import { ListProductReqDTO } from "../dtos/request/product-list-req.dto";
import { ProductListResponse, ProductResponse } from "../dtos/response/product-res.dto";
import { ProductService } from "src/app/product/product.service";

@Controller({ path: 'products' })
export class ProductController {

    constructor(private readonly productService: ProductService) { }
    @Get()
    @LogAround({
        ignoreReturn: true
    })
    async listProducts(
        @Query() query: ListProductReqDTO
    ): Promise<ProductListResponse> {
        return await this.productService.listProducts(query);
    }

    @Get(':productId')
    @LogAround({
        ignoreReturn: true
    })
    async getProductDetails(
        @Param('productId') productId: string
    ): Promise<ProductResponse> {
        return await this.productService.getProductDetails(productId);
    }

    @Get(':productId/orders')
    @LogAround({
        ignoreReturn: true
    })
    async getProductsWithOrder(
        @Param('productId') productId: string,
        @Query('orderStatus') orderStatus: string,
        @Query('paymentStatus') paymentStatus: string,
        @Query('totalPrice') totalPrice: number,
        @Query('operator') operator: string
    ): Promise<ProductResponse> {
        return await this.productService.getProductsWithOrder(
            productId,
            orderStatus,
            paymentStatus,
            totalPrice,
            operator
        );
    }

    @Get(':productId/carts')
    @LogAround({
        ignoreReturn: true
    })
    async getProductsWithCarts(
        @Param('productId') productId: string,
        @Query('totalPrice') totalPrice: number,
        @Query('operator') operator: string,
        @Query('status') status: string
    ): Promise<ProductResponse> {
        return await this.productService.getProductsWithCarts(
            productId,
            totalPrice,
            operator,
            status
        )
    }
}