import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOneById(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }
}
