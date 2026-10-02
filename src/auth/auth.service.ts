import { UnauthorizedException, ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

    
    async createUser(data: AuthDto) {
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
    const newUser = await this.prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });
    const payload = { sub: newUser.id, username: newUser.username };
    const token = await this.jwtService.signAsync(payload);
    return {
      user: newUser,
      access_token: token,
    };
  }

  async logInUser(data: AuthDto) {
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
    if(!isMatch) {
        throw new UnauthorizedException('Неверный логин или пароль');
    } 
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      access_token: token,
    };
  }
    
}
