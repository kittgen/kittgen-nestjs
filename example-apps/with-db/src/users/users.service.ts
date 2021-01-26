import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepo.save(new User({ ...createUserDto }));
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepo.findOneOrFail(userId);
    this.userRepo.save(new User({ id: userId, ...updateUserDto }));
  }
}
