import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/modules/users/repository/user.repository';
import { CreateUserDto } from '../dtos/create.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: number) {
    return this.userRepository.findOneById(id);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }
}
