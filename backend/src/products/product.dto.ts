import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductVariantDto {
  @IsOptional() @IsString() _id?: string;
  @IsString() name: string;
  @IsString() sku: string;
  @IsOptional() @IsString() image?: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() soldOut?: boolean;
}

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() image?: string;
  @IsString() description: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
  @IsOptional() @IsBoolean() soldOut?: boolean;
  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProductVariantDto) variants?: ProductVariantDto[];
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) stock?: number;
  @IsOptional() @IsBoolean() soldOut?: boolean;
  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ProductVariantDto) variants?: ProductVariantDto[];
}

