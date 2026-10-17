import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsOptional() 
  @MinLength(3, { message: 'Имя пользователя должно быть не менее 3 символов' })
  @MaxLength(20, { message: 'Имя пользователя не должно превышать 20 символов' })
  username?: string; 

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsOptional() 
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password?: string;
}
