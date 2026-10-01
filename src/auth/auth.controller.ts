import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

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
    @UseGuards(AuthGuard)
    @Get('/profile')
      getProfile(@Request() req) {
        return req.user; 
      }
  }

