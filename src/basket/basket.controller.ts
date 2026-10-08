import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/create-basket.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('products')
  addProduct(@Req() req: any, @Body() dto: AddToBasketDto) {
    const userId = req.user.sub; 
    return this.basketService.addProductToBasket(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(+id);
  }
}
