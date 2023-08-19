import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';

import { UserService } from '@/modules/users/services/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCustomHeader } from '@/shared/swagger/decorator';

@ApiTags('Users')
@ApiCustomHeader()
@Controller('users')
// @UseInterceptors(ApiResponse)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
