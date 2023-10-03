import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TodoService } from '../services/todo.service';
import { ApiCustomHeader } from '@/shared/swagger/decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@/middlewares/auth.middleware';
import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { CreateTodoDTO } from '../dtos/create.dto';
import { CategoryService } from '@/modules/categories/services/category.service';

@ApiTags('Todo')
@ApiCustomHeader()
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/')
  async findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
    return this.todoService.findOneById(id);
  }

  @Post('/')
  async create(@Body() data: CreateTodoDTO, @Req() request: Request) {
    const category = await this.categoryService.findOneById(data.category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    return this.todoService.create(data, request['user']);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: CreateTodoDTO) {
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  async destroy(@Param('id') id: number) {
    return this.todoService.destroy(id);
  }
}
