import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto, userId: number) {
    const uniqueIds = [...new Set(data.categoryIds)];

    const count = await this.prisma.category.count({
      where: {
        id: { in: uniqueIds },
      },
    });

    const allExist = count === uniqueIds.length;
    if (!allExist) {
      throw new BadRequestException(
        'Одна или несколько категорий невалидны в запросе',
      );
    }

    const newProduct = await this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        imageSrc: data.imageSrc,
        userId: userId,
        quantity: data.quantity,
        categories: {
          create: uniqueIds.map((id) => ({
            categoryId: id,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageSrc: true,
        categories: {
          select: {
            category: true,
          },
        },
      },
    });

    return newProduct;
  }

  async findAll() {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageSrc: true,
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageSrc: true,
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Продукт с таким ID не найден');
    return product;
  }

  async remove(id: number, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: id, userId: userId },
    });
    if (!product) {
      throw new NotFoundException(
        'Товар с таким ID не найден или у вас нет прав!',
      );
    }

    await this.prisma.product.delete({
      where: { id, userId: userId },
    });

    return { message: 'Товар успешно удален' };
  }

  async update(id: number, dto: UpdateProductDto, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: id, userId: userId },
    });
    if (!product) {
      throw new NotFoundException('Товар не найден или у вас нет прав!');
    }

    const updateData: Prisma.ProductUpdateInput = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      imageSrc: dto.imageSrc,
    };

    if (dto.categoryIds) {
      if (!dto.categoryIds.length) {
        throw new BadRequestException('Товар не может быть без категорий!');
      }

      const uniqueIds = [...new Set(dto.categoryIds)];
      const count = await this.prisma.category.count({
        where: {
          id: { in: uniqueIds },
        },
      });

      if (count !== uniqueIds.length) {
        throw new BadRequestException(
          'Одна или несколько категорий невалидны в запросе',
        );
      }

      updateData.categories = {
        deleteMany: {},
        createMany: {
          data: uniqueIds.map((catId) => ({ categoryId: catId })),
        },
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }
}
