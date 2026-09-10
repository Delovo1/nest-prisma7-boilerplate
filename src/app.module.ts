import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Импортируем модуль конфигурации
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Добавляем ПЕРВЫМ, чтобы .env прочитался сразу!
    PrismaModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
