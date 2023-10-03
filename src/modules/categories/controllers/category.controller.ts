import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { ApiCustomHeader } from '@/shared/swagger/decorator';
import { AuthGuard } from '@/middlewares/auth.middleware';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { CreateCategoryDto } from '../dtos/create.dto';

@ApiTags('Categories')
@ApiCustomHeader()
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
    return this.categoryService.findOneById(id);
  }

  @Post('/')
  async create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: CreateCategoryDto) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  async destroy(@Param('id') id: number) {
    return this.categoryService.destroy(id);
  }
}
