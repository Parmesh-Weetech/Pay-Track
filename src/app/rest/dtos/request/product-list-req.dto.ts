import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";

export class ListProductReqDTO extends OmitType(PaginationFilter, ['status'] as const) {
    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    isAvailable?: boolean;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    category?: string;

    @IsOptional()
    @IsNumber()
    @IsInt()
    price?: number;

    @IsString()
    @ValidateIf(data => data.price)
    @IsNotEmpty()
    operator?: string;
}