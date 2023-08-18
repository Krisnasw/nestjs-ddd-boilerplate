import { applyDecorators } from '@nestjs/common';
import { ApiHeaders } from '@nestjs/swagger';
import { SettingService } from '@/shared/services/setting.service';

const configService = new SettingService();

export function ApiCustomHeader() {
  return applyDecorators(
    ApiHeaders([
      {
        name: configService.app.versionKey,
        description: 'API version. ieg: 1',
        example: 1,
      },
      {
        name: configService.headerKey.lang,
        description: 'User Language. ieg: id',
        example: 'en',
      },
      {
        name: configService.headerKey.timezone,
        description: 'User timezone. ieg: Asia/Jakarta',
        example: 'Asia/Jakarta',
      },
      {
        name: configService.headerKey.appVersion,
        description: 'Client app version ieg: 1.0.0',
        example: '1.0.0',
      },
      {
        name: configService.headerKey.appPlatform,
        description: 'Client app platform ios or android',
        example: 'ios',
      },
      {
        name: configService.headerKey.userId,
        description: 'Logged in user id',
        example: 'id',
      },
      {
        name: configService.headerKey.userUuid,
        description: 'Logged in user uuid',
        example: 'uuid',
      },
    ]),
  );
}
