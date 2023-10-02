import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOneById(id: number) {
    return this.prisma.users.findFirst({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.users.findFirst({ where: { email } });
  }

  async create(data: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      },
    });
  }
}
