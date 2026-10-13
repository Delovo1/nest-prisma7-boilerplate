import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Request } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/create-basket.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}


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

  @Get()
  findAll() {
    return this.basketService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(+id);
  }
}
