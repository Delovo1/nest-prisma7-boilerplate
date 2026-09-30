import { UnauthorizedException, ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    
    async createUser(data: { username?: string; password?: string }) {
    if (!data.username || !data.password) {
      throw new BadRequestException('Логин и пароль обязательны для заполнения');
    }

    const candidate = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (candidate) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }

    // 3. Хешируем
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Создаем запись
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }

  async logInUser(data: { username?: string; password?: string } ) {
     if (!data.username || !data.password) {
      throw new BadRequestException('Логин и пароль обязательны для заполнения');
    }
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if(!user) {
      throw new UnauthorizedException('Неверный логин или пароль!');
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if(isMatch) {
        return "Okey, thats really you"
    } 
    return "No, you are lying me"
  }
    
}
