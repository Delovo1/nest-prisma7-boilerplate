import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToBasketDto } from './dto/create-basket.dto';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}
  
  async addProductToBasket(userId: number, dto: AddToBasketDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const basketProduct = await this.prisma.basketProduct.upsert({
      where: {
        basketId_productId: {
          basketId: userId,
          productId: dto.productId,
        },
      },
      create: {
        basketId: userId,
        productId: dto.productId,
        quantity: dto.quantity || 1,
      },
      update: {
        quantity: {
          increment: dto.quantity || 1,
        },
      },
    });

    return { message: 'Товар успешно добавлен в корзину', basketProduct };
  }

  findOne(id: number) {
    return `This action returns a #${id} basket`;
  }

  remove(id: number) {
    return `This action removes a #${id} basket`;
  }
}
