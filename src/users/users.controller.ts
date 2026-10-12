import { Controller, Get, Param, Delete, Patch, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() async findAll(){
      return this.usersService.getUsers();
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
    
  @Patch(':id') 
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const hasUpdates = Object.values(dto).some(value => value !== undefined);

    if (!hasUpdates) {
      throw new BadRequestException('Тело запроса не может быть пустым. Передайте хотя бы одно поле для обновления.');
    }

    return this.usersService.update(+id, dto);
  }
  
}
