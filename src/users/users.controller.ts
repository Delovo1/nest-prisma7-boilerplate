import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Все маршруты в этом контроллере будут начинаться с /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Обрабатывает POST-запросы на URL: http://localhost:3000/users
  async create(@Body() body: { email: string; username?: string; name?: string }) {
    return this.usersService.createUser(body);
  }

  @Get() // Обрабатывает GET-запросы на URL: http://localhost:3000/users
  async findAll() {
    return this.usersService.getAllUsers();
  }
}
