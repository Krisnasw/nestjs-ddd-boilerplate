import { PrismaService } from '@/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

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
