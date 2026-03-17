import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";
import { OmitType } from '@nestjs/swagger';

export class ListTransactionReqDTO extends OmitType(PaginationFilter, ['search', 'status'] as const) {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    transactionStatus?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    userId?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    orderId?: string;
}