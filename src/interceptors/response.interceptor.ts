import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Request successful',
        data,
      })),
      catchError((error) => {
        const statusCode =
          error?.status || context.switchToHttp().getResponse().statusCode;
        const message = error?.message || 'Something went wrong';
        error.name = 'minerallink-service-error';

        throw new HttpException(
          {
            success: false,
            statusCode,
            message,
            data: null,
            error,
          },
          statusCode,
          {
            cause: error,
          },
        );
      }),
    );
  }
}
