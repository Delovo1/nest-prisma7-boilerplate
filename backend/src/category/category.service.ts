import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
  return await this.prisma.category.findMany({
      select: {
        id: true,
        name: true
      },
    });
  }

  async findOne(id: number) {
    const newCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true
      },
    });
    if(!newCategory) throw new NotFoundException("Нет категории по такому id");
    return newCategory
  }

  async update(id: number, updateData: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        name: updateData.name,
      }
    })

    if(category && category.id !== id) throw new ConflictException('Это название категории уже занято');

    return this.prisma.category.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Категория с таким ID не найдена');
    }
  
    await this.prisma.category.delete({
      where: { id },
    });
  
    return { message: 'Категория успешно удалена' };
    }
}
