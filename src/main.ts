import * as rateLimit from '@fastify/rate-limit';
import * as helmet from '@fastify/helmet';
import * as compress from '@fastify/compress';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  NestInterceptor,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module';
import { SharedModule } from './shared.module';
import { SettingService } from './shared/services/setting.service';
import { setupSwagger } from './shared/swagger/setup';
import { NewrelicInterceptor } from './interceptors/newrelic.interceptor';
import { CustomI18nValidationExceptionFilter } from './filters/custom-i18n-exception.filter';
import { i18nValidationErrorFactory } from 'nestjs-i18n';

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
    // new ContextRequestInterceptor(settingService),
    new ClassSerializerInterceptor(app.get(Reflector)),
  ];

  // NEWRELIC
  if (settingService.newrelic.enabled) {
    globalInterceptors = [
      ...globalInterceptors,
      new NewrelicInterceptor(settingService),
    ];
  }

  // const loggerService = app.select(SharedModule).get(LoggerService);
  // app.useLogger(loggerService);
  // if (settingService.log.morgan.enabled) {
  //   app.use(
  //     morgan('combined', {
  //       stream: {
  //         write: (message) => {
  //           loggerService.log(message);
  //         },
  //       },
  //     }),
  //   );
  // }

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

  app.useGlobalFilters(
    // new NotFoundExceptionFilter(loggerService),
    // new HttpExceptionFilter(loggerService),
    new CustomI18nValidationExceptionFilter(),
  );

  app.useGlobalInterceptors(...globalInterceptors);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: i18nValidationErrorFactory,
      validationError: {
        target: false,
      },
    }),
  );

  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: settingService.app.versionKey,
  //   defaultVersion: settingService.app.versionDefault || VERSION_NEUTRAL,
  // });

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
