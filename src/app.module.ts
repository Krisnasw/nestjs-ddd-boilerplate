import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { AbstractRequestContext } from './common/contexts/abstract-request.context';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared.module';
import { SnakeNamingStrategy } from './shared/typeorm/strategies/snake-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      keepConnectionAlive: true,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false,
      migrationsRun: false,
      namingStrategy: new SnakeNamingStrategy(),
      extra: {
        connectionLimit: process.env.DB_CONNECTION_LIMIT || 100,
      },
      logging: process.env.NODE_ENV === 'development' ? true : false,
      cache: {
        type: 'redis',
        options: {
          url: process.env.REDIS_URL,
        },
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    RequestContextModule.forRoot({
      contextClass: AbstractRequestContext,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TerminusModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
