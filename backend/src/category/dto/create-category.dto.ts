import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MinLength(3, { message: 'Название должно быть не менее 3 символов' })
  @MaxLength(20, { message: 'Название не должно превышать 20 символов' })
  name: string;
}
