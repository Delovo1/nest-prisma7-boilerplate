import { Controller, Get, Param, Delete, Patch, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-users.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get() async findAll(){
      return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
    
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id') 
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const hasUpdates = Object.values(dto).some(value => value !== undefined);

    if (!hasUpdates) {
      throw new BadRequestException('Тело запроса не может быть пустым. Передайте хотя бы одно поле для обновления.');
    }

    return this.usersService.update(+id, dto);
  }
  
}
