import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('/')
@ApiTags('hello-world')
export class AppController {
  constructor(
    private readonly _appService: AppService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @ApiResponse({ status: HttpStatus.OK, description: 'Hello world' })
  getHello(): string {
    return this._appService.getHello();
  }
}
