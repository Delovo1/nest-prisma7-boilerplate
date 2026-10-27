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
    for (const element of basketItems) {
    }
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
