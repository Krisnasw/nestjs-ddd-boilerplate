import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { ApiCustomHeader } from '@/shared/swagger/decorator';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthRegisterDto } from '../dtos/create.dto';
import { AuthLoginDto } from '../dtos/auth.dto';

@ApiTags('Auth')
@ApiCustomHeader()
@ApiBearerAuth()
@UseInterceptors(TransformResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async doRegister(@Body() data: AuthRegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async doLogin(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }
}
