import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async findOne(user_id: number, id: number) {
    const basketProduct = await this.prisma.basketProduct.findUnique({
      where: {
        basketId_productId: {
          basketId: user_id,
          productId: id,
        },
      },
      include: {
        product: true,
      },
    });
    if(!basketProduct) throw new BadRequestException("Нет такого товара в корзине!")
    return basketProduct;
  }

  async findAll(user_id: number) {
    return this.prisma.basketProduct.findMany({
      where: {
        basketId: user_id,
      },
      include: {
        product: true,
      },
    });
  }

  async remove(user_id: number, id: number) {
  const basketProduct = await this.prisma.basketProduct.findUnique({
    where: {
      basketId_productId: {
        basketId: user_id,
        productId: id,
      },
    },
  });

  if (!basketProduct) {
    throw new NotFoundException('Данный товар отсутствует в вашей корзине');
  }

  await this.prisma.basketProduct.delete({
    where: {
      basketId_productId: {
        basketId: user_id,
        productId: id,
      },
    },
  });
  
  return { message: 'Товар успешно удален из корзины' };
  }
}
