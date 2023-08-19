import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import newrelic from 'newrelic';
import { SettingService } from '@/shared/services/setting.service';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  constructor(private readonly _configService: SettingService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (this._configService.newrelic.blacklist.includes(request.route.path)) {
      newrelic.getTransaction().ignore();
      return next.handle();
    }
    return newrelic.startWebTransaction(context.getHandler().name, function () {
      newrelic.setTransactionName(request.method + ' ' + request.route.path);
      const transaction = newrelic.getTransaction();
      return next.handle().pipe(tap(() => transaction.end()));
    });
  }
}
