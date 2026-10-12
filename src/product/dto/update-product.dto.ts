import { IsArray, IsString, IsNumber, MinLength, MaxLength, Min, IsPositive, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'Название товара должно быть строкой' })
  @IsOptional()
  @MinLength(3, { message: 'Название товара должно быть не менее 3 символов' })
  @MaxLength(50, { message: 'Название товара не должно превышать 50 символов' }) 
  name?: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsOptional()
  @IsPositive({ message: 'Цена должна быть больше нуля' }) 
  @Min(1, { message: 'Минимальная цена — 1' }) 
  price?: number; 

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional() 
  description?: string;

  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  @IsOptional() 
  imageSrc?: string;

  @IsArray({ message: 'Категории должны быть переданы в виде массива' })
  @IsOptional()
  @IsNumber({}, { each: true, message: 'Каждый ID категории должен быть числом' })
  categoryIds?: number[]; 
}
