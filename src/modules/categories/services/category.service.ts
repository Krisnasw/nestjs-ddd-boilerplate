import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create.dto';
import { CategoryRepository } from '../repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAll() {
    return this.categoryRepository.getAll();
  }

  async findOneById(id: number) {
    return this.categoryRepository.findOneById(id);
  }

  async create(data: CreateCategoryDto) {
    return this.categoryRepository.create(data);
  }

  async update(id: number, data: CreateCategoryDto) {
    return this.categoryRepository.update(id, data);
  }

  async destroy(id: number) {
    return this.categoryRepository.destroy(id);
  }
}
