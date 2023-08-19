import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

import { SettingService } from './setting.service';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly configService: SettingService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: Number(this.configService.get('HTTP_TIMEOUT') ?? 30000),
      maxRedirects: Number(this.configService.get('HTTP_MAX_REDIRECTS') ?? 5),
    };
  }
}
