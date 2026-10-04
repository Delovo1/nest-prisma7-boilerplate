import { IsString, IsNumber, IsNotEmpty, MinLength, MaxLength, Min, IsPositive, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Название товара должно быть строкой' })
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  @MinLength(3, { message: 'Название товара должно быть не менее 3 символов' })
  @MaxLength(50, { message: 'Название товара не должно превышать 50 символов' }) // 20 может быть маловато для маркетплейса
  name: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена не может быть пустой' })
  @IsPositive({ message: 'Цена должна быть больше нуля' }) // Гарантирует, что цена не уйдет в минус
  @Min(1, { message: 'Минимальная цена — 1' }) // Вместо MinLength проверяем минимальное значение цены
  price: number; // ТИП ДАННЫХ ИЗМЕНЕН НА number 

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional() // Поле description в Prisma помечено как String?, значит оно необязательное
  description?: string;

  @IsString({ message: 'Ссылка на изображение должна быть строкой' })
  @IsOptional() // Поле imageSrc в Prisma тоже необязательное
  imageSrc?: string;

  @IsNumber({}, { message: 'ID категории должно быть числом' })
  @IsNotEmpty({ message: 'Категория товара обязательна для заполнения' })
  categoryId: number; // Передаем ID созданной ранее категории
}
