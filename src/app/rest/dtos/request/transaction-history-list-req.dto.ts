import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationFilter } from "src/app/common/pagination/pagination-filter";

export class ListTransactionHistoryReqDTO extends OmitType(PaginationFilter, ['search', 'status'] as const) {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    previousState?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    newState?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    changedBy?: string;
}