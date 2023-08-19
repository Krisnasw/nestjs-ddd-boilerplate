import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  MicroserviceHealthIndicator,
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';

import { AppService } from './app.service';
import { SettingService } from './shared/services/setting.service';

@Controller('/')
@ApiTags('hello-world')
export class AppController {
  constructor(
    private readonly _appService: AppService,
    private health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly configService: SettingService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @ApiResponse({ status: HttpStatus.OK, description: 'Hello world' })
  getHello(): string {
    return this._appService.getHello();
  }

  @Get('health-check')
  @HealthCheck()
  async healthCheck() {
    const dbCheckResult = await this.db.pingCheck(
      'database',
      new PrismaClient(),
    );
    const redisCheckResult = await this.microservice.pingCheck<RedisOptions>(
      'redis',
      {
        transport: Transport.REDIS,
        options: {
          host: this.configService.redis.host,
          port: +this.configService.redis.port,
          username: this.configService.redis.user,
          password: this.configService.redis.password,
          connectionName: this.configService.redis.connectionName,
        },
      },
    );

    return this.health.check([dbCheckResult, redisCheckResult]);
  }
}
