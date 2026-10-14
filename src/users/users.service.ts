import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
      }
    })
  }

  async findOne(id: number) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          username: true
        },
      });
      if(!user) throw new BadRequestException("Нет такого пользователя!");
      return user;
    }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь с таким ID не найден');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удален' };
    }

    async update(id: number, dto: UpdateUserDto) {
      const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const updateData: any = {};

    if (dto.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Это имя пользователя уже занято');
      }

      updateData.username = dto.username;
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
    }
  
}
