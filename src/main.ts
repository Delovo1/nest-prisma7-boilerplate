import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Включаем глобальную валидацию
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Автоматически удалит из запроса любые лишние поля, которых нет в DTO (защита от хакеров)
    forbidNonWhitelisted: true, // Выбросит ошибку, если фронтенд шлет неизвестные серверу поля
  }));

  await app.listen(3000);
}
bootstrap();
