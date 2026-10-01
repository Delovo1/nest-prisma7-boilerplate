import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  // Внедряем JwtService в конструктор, чтобы проверять токены
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 1. Извлекаем чистый токен из заголовка Authorization
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы (токен отсутствует)');
    }
    
    try {
      // 2. Самая главная проверка! Сверяем токен с нашим секретным словом
      // Если токен подделан или протух, метод выбросит ошибку и улетит в catch
      const payload = await this.jwtService.verifyAsync(token);
      
      // 3. Записываем данные юзера (id и username) в объект запроса request
      // Теперь любой контроллер, защищенный этим гвардом, будет знать КТО делает запрос
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Токен не прошел проверку секретным словом или протух');
    }
    
    return true; // Проверка пройдена, пускаем к контроллеру!
  }

  // Метод-помощник: срезает слово "Bearer " и забирает только сам JWT
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
