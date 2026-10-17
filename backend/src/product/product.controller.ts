import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id') 
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
      const hasUpdates = Object.values(dto).some(value => value !== undefined);
  
      if (!hasUpdates) {
        throw new BadRequestException('Тело запроса не может быть пустым. Передайте хотя бы одно поле для обновления.');
      }
  
      return this.productService.update(+id, dto);
    }
  
}
