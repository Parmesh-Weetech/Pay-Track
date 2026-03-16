import { APIResponse } from "../../../common/helper/response";
import { ApiProperty } from "@nestjs/swagger";
import { ListResponse } from "../list.dto";
import { CartSchema } from "src/app/cart/schemas/cart.schema";

export class CartListResponse extends APIResponse {
    @ApiProperty({ type: () => ListResponse })
    data: ListResponse
}

export class CartResponse extends APIResponse {
    @ApiProperty({ type: () => CartSchema })
    data: CartSchema
}