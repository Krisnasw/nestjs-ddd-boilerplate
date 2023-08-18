import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MicroserviceHealthIndicator, TypeOrmHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { AppService } from './app.service';
import { SettingService } from './shared/services/setting.service';

@Controller('/')
@ApiTags('hello-world')
export class AppController {
    constructor(
        private readonly _appService: AppService,
        private health: HealthCheckService,
        private readonly microservice: MicroserviceHealthIndicator,
        private readonly db: TypeOrmHealthIndicator,
        private readonly configService: SettingService,
    ) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, description: 'Hello world' })
    getHello(): string {
        return this._appService.getHello();
    }

    @Get('health-check')
    @HealthCheck()
    healthCheck() {
        return this.health.check([
            async () => this.db.pingCheck('database'),
            async () =>
                this.microservice.pingCheck<RedisOptions>('redis', {
                    transport: Transport.REDIS,
                    options: {
                        host: this.configService.redis.host,
                        port: +this.configService.redis.port,
                        username: this.configService.redis.user,
                        password: this.configService.redis.password,
                        connectionName: this.configService.redis.connectionName,
                    },
                }),
        ]);
    }
}