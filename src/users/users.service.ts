import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
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
}
