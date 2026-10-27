import {
  IsArray,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateOrderDto {
  @IsString({ message: 'Адрес доставки должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес доставки не может быть пустым' })
  @MinLength(5, { message: 'Адрес доставки должен быть не менее 5 символов' })
  @MaxLength(100, {
    message: 'Адрес доставки не должно превышать 100 символов',
  })
  deliveryAddress: string;

  @IsArray({ message: 'Товары должны быть переданы в виде массива' })
  @IsNotEmpty({ message: 'Хотя бы один товар должен быть в заказе' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsInt({ message: 'ID товара должен быть целым числом' })
  @IsNotEmpty({ message: 'ID товара не может быть пустым' })
  @IsPositive({ message: 'ID товара должен быть положительным числом' })
  productId: number;

  @IsNumber({}, { message: 'Количество должно быть числом' })
  @IsNotEmpty({ message: 'Количество не может быть пустым' })
  @IsPositive({ message: 'Количество должна быть больше нуля' })
  @Min(1, { message: 'Минимальное количество = 1' })
  quantity: number;
}
