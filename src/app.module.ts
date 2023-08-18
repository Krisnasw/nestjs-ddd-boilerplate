import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { AbstractRequestContext } from './common/contexts/abstract-request.context';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { SharedModule } from './shared.module';
import { UserModule } from './modules/users/users.module';
import { PrismaService } from './shared/prisma/prisma.service';

@Module({
  imports: [
    UserModule,
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
  providers: [AppService, PrismaService],
})
export class AppModule {}
