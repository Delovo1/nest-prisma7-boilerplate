import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
    @Post("/register")
      async create(@Body() body: { username?: string; password?: string }) {
        return this.authService.createUser(body);
      }
    @Post("/login")
      async logIn(@Body() body: { username?: string; password?: string }) {
        return this.authService.logInUser(body);
      }
  }

