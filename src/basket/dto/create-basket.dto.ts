import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class AddToBasketDto {
  @IsNumber({}, { message: 'ID товара должно быть числом' })
  productId: number;

  @IsNumber({}, { message: 'Количество должно быть числом' })
  @IsOptional()
  @IsPositive({ message: 'Количество должно быть больше нуля' })
  @Min(1, { message: 'Минимальное количество товара — 1' })
  quantity?: number = 1; // значение по умолчанию
}
