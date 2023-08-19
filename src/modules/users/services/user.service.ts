import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/modules/users/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findOneById(id);
  }
}
