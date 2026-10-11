import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}
  

  async create(data: CreateCategoryDto) {
      const newCategory = await this.prisma.category.create({
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true
      },
    });
    return newCategory
  }

  async findAll() {
   const newCategory = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true
      },
    });
    if(!newCategory.length) throw new BadRequestException("Нет категорий");
    return newCategory;
  }

  async findOne(id: number) {
    const newCategory = await this.prisma.category.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true
      },
    });
    if(!newCategory.length) throw new BadRequestException("Нет категории по такому id");
    return newCategory
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
