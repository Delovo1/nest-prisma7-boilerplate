import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProductService {

    constructor(private readonly prisma: PrismaService) {}
  
  async create(data: CreateProductDto) {
    const uniqueIds = [...new Set(data.categoryIds)];

    const count = await this.prisma.category.count({
      where: {
        id: { in: uniqueIds },
      },
    });

    const allExist = count === uniqueIds.length;
    if(!allExist) {
      throw new BadRequestException('Одна или несколько категорий невалидны в запросе');
    }

    const newProduct = await this.prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      imageSrc: data.imageSrc,
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
          category: true 
        }
      }
    },
  });

    return newProduct
        
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
            category: true 
          }
      }
      }
    })
  }

  async findOne(id: number) {
    return await this.prisma.product.findMany({
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
            category: true 
          }
      }
      }
    })
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
