import { APIResponse } from "../../../common/helper/response"
import { ApiProperty } from "@nestjs/swagger"
import { ListResponse } from "../list.dto"
import { ProductSchema } from "src/app/product/schemas/product.schema"

export class ProductListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse
}

export class ProductResponse extends APIResponse {
    @ApiProperty({ type: () => ProductSchema })
    data: ProductSchema | null;
}