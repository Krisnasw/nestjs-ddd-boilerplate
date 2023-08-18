import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SettingService } from '@/shared/services/setting.service';
import { ISwaggerConfigInterface } from '@/interfaces/swagger.interface';

export function setupSwagger(
  app: INestApplication,
  config: ISwaggerConfigInterface,
) {
  const configService = new SettingService();
  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addServer(configService.app.url)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  SwaggerModule.setup(config.path, app, document);
}
