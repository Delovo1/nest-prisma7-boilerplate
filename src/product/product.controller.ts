import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Patch(':id') 
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
      const hasUpdates = Object.values(dto).some(value => value !== undefined);
  
      if (!hasUpdates) {
        throw new BadRequestException('Тело запроса не может быть пустым. Передайте хотя бы одно поле для обновления.');
      }
  
      return this.productService.update(+id, dto);
    }
  
}
