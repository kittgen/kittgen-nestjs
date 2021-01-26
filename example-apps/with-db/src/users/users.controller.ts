import { PermissionGuard } from '@kittgen/nestjs-authorization';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserAction } from './actions';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(PermissionGuard(UserAction.CanCreate))
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(PermissionGuard(UserAction.CanEdit))
  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.update(userId, updateUserDto);
  }
}
