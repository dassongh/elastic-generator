import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export abstract class BaseQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  page: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  limit: number;
}
