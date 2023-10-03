import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateCategoryDto } from '../dtos/create.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.categories.findMany();
  }

  async findOneById(id: number) {
    return this.prisma.categories.findFirst({ where: { id } });
  }

  async create(data: CreateCategoryDto) {
    try {
      return await this.prisma.$transaction([
        this.prisma.categories.create({ data }),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: CreateCategoryDto) {
    try {
      return await this.prisma.$transaction([
        this.prisma.categories.update({ where: { id }, data }),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async destroy(id: number) {
    try {
      return await this.prisma.categories.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
