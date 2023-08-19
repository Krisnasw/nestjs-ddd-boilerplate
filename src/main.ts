import * as rateLimit from '@fastify/rate-limit';
import * as helmet from '@fastify/helmet';
import * as compress from '@fastify/compress';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SharedModule } from './shared.module';
import { SettingService } from './shared/services/setting.service';
import {
  NestInterceptor,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ContextRequestInterceptor } from './interceptors/context-request.interceptor';
import { setupSwagger } from './shared/swagger/setup';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    { bufferLogs: true },
  );

  const settingService = app.select(SharedModule).get(SettingService);
  let globalInterceptors: NestInterceptor[] = [
    new ContextRequestInterceptor(settingService),
    new ClassSerializerInterceptor(app.get(Reflector)),
  ];

  app.register(helmet);
  app.register(compress);
  app.enableCors({
    origin: '*',
  });

  if (settingService.rateLimit.enabled) {
    app.register(rateLimit, {
      max: settingService.rateLimit.max,
      timeWindow: settingService.rateLimit.windowMs,
    });
  }

  app.useGlobalInterceptors(...globalInterceptors);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // exceptionFactory: i18nValidationErrorFactory,
      validationError: {
        target: false,
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: settingService.app.versionKey,
    defaultVersion: settingService.app.versionDefault || VERSION_NEUTRAL,
  });

  if (['development', 'staging'].includes(settingService.nodeEnv)) {
    setupSwagger(app, settingService.swaggerConfig);
  }

  app.setGlobalPrefix('api');

  const port = settingService.getNumber('PORT') || 4000;
  const host = settingService.get('HOST') || '127.0.0.1';
  await app.listen(port, host);

  console.warn(`server running on port ${host}:${port}`);
}
bootstrap();
