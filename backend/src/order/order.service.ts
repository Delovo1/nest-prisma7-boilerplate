import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: number, createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.items.map((v) => v.productId);

    const basketItems = await this.prisma.basketProduct.findMany({
      where: {
        basketId: id,
        productId: { in: productIds },
      },
      include: {
        product: true,
      },
    });

    if (productIds.length !== basketItems.length)
      throw new BadRequestException(
        'Некоторые товары отсутствуют в вашей корзине',
      );

    for (const element of createOrderDto.items) {
      const basketItem = basketItems.find(
        (v) => v.productId === element.productId,
      );
      if (!basketItem)
        throw new BadRequestException(
          'Каким-то образом у вас нет этого товара в корзине',
        );

      if (basketItem.product.quantity < element.quantity) {
        throw new BadRequestException(
          'Вы пытаетесь заказать товара больше, чем есть на самом складе!',
        );
      }
    }

    const order = await this.prisma.order.create({
      data: {
        deliveryAddress: createOrderDto.deliveryAddress,
        userId: id,
      },
    });

    for (const element of createOrderDto.items) {
      const basketItem = basketItems.find(
        (v) => v.productId === element.productId,
      );
      if (!basketItem)
        throw new BadRequestException(
          'Каким-то образом у вас нет этого товара в корзине',
        );
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: element.productId,
          price: basketItem.product.price,
          quantity: element.quantity,
          title: basketItem.product.name,
        },
      });

      await this.prisma.product.update({
        where: { id: element.productId },
        data: {
          quantity: basketItem.product.quantity - element.quantity,
        },
      });
    }

    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
