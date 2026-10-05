import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProductService {

    constructor(private readonly prisma: PrismaService) {}
  
  create(createProductDto: CreateProductDto) {
    async create(data: createProductDto) {
          const newCategory = await this.prisma.category.create({
          data: {
            name: data.name,
            price: data.price,
            description: data.description,
            imageSrc: data.imageSrc,
            
          },
          // select: {
          //   id: true,
          //   name: true
          // },
        });
        return newCategory
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
