import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';

import { SettingService } from './shared/services/setting.service';

const providers = [SettingService];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
