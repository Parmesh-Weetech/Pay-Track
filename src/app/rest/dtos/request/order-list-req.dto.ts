import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";

export class ListOrderReqDTO extends OmitType(PaginationFilter, ['search', 'status'] as const) {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    @Transform(({ value }) => value)
    orderStatus?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    @Transform(({ value }) => value)
    paymentStatus?: string;

    @IsOptional()
    @IsNumber()
    @IsInt()
    @ApiPropertyOptional()
    totalPrice?: number;

    @IsString()
    @ValidateIf(data => data.totalPrice)
    @IsNotEmpty()
    operator?: string;
}