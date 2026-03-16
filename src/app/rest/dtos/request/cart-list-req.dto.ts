import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";

export class ListCartReqDTO extends OmitType(PaginationFilter, ['search'] as const) {
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