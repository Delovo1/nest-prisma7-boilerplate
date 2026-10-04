import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';

@Injectable()
export class BasketService {
  create(createBasketDto: CreateBasketDto) {
    return 'This action adds a new basket';
  }

  findAll() {
    return `This action returns all basket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basket`;
  }

  remove(id: number) {
    return `This action removes a #${id} basket`;
  }
}
