import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '1d') as any,
        },
      })
    }),
    UsersModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}
