import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  // NestJS автоматически внедряет сюда наш сервис базы данных
  constructor(private prisma: PrismaService) {}

  // Метод для создания нового пользователя
  async createUser(data: { email: string; username?: string; name?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
      },
    });
  }

  // Метод для получения списка всех пользователей
  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        posts: true, // Сразу подтянем связанные посты, если они есть
      },
    });
  }
}
