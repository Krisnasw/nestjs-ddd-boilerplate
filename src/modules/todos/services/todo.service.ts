import { Injectable } from '@nestjs/common';
import { CreateTodoDTO } from '../dtos/create.dto';
import { TodoRepository } from '../repository/todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findAll() {
    return this.todoRepository.findAll();
  }

  async findOneById(id: number) {
    return this.todoRepository.findOneById(id);
  }

  async create(data: CreateTodoDTO, user: any) {
    if (!user) {
      throw new Error('User not found');
    }

    data.user_id = user.id;

    return this.todoRepository.create(data);
  }

  async update(id: number, data: CreateTodoDTO) {
    return this.todoRepository.update(id, data);
  }

  async destroy(id: number) {
    return this.todoRepository.destroy(id);
  }
}
