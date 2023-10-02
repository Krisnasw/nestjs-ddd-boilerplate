import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from '@/modules/users/services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiCustomHeader } from '@/shared/swagger/decorator';
import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { AuthGuard } from '@/middlewares/auth.middleware';

@ApiTags('Users')
@ApiCustomHeader()
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(TransformResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
}
