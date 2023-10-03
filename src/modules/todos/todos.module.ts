import { Module } from '@nestjs/common';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepository } from './repository/todo.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, PrismaService],
})
export class TodosModule {}
