import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [BasketController],
  providers: [BasketService],
  imports: [
    PrismaModule, 
    AuthModule 
  ],
})
export class BasketModule {}
