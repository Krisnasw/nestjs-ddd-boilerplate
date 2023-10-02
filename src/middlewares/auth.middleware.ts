import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { SettingService } from '@/shared/services/setting.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
@UseInterceptors(TransformResponseInterceptor)
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly settingService: SettingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.settingService.jwtConfig.secretKey,
      });
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid access');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
