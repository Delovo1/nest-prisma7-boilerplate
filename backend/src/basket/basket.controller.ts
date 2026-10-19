import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/create-basket.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @UseGuards(AuthGuard)
  @Post('products')
  addProduct(@Req() req: any, @Body() dto: AddToBasketDto) {
    const userId = req.user.sub; 
    return this.basketService.addProductToBasket(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.basketService.findOne(req.user.sub, +id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.basketService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.basketService.remove(req.user.sub, +id);
  }
}
