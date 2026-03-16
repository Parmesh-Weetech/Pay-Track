import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { toNumber } from '../utils/transformer';
import { SORT_ORDER, type SortOrder } from '../types/sort-type';

export class PaginationFilter {
    @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    public page = 1;

    @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
    @IsOptional()
    @ApiPropertyOptional({ type: Number })
    public pageSize = 10;

    @IsOptional()
    @ApiPropertyOptional()
    public orderBy?: string;

    @IsEnum(SORT_ORDER)
    @IsOptional()
    @ApiPropertyOptional()
    public sortOrder?: SortOrder = SORT_ORDER.DESC;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    search?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional()
    status?: string;

    
}
