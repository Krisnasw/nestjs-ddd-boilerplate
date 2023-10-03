import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateTodoDTO } from '../dtos/create.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.todos.findMany();
  }

  async findOneById(id: number) {
    return this.prisma.todos.findFirst({ where: { id } });
  }

  async create(data: CreateTodoDTO) {
    try {
      return await this.prisma.$transaction([
        this.prisma.todos.create({ data }),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: CreateTodoDTO) {
    try {
      return await this.prisma.$transaction([
        this.prisma.todos.update({ where: { id }, data }),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async destroy(id: number) {
    try {
      return await this.prisma.todos.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
