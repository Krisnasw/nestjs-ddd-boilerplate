import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '../shared/services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger: LoggerService) {}
  contextName = 'CustomHttpError';
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (request) {
      const exceptionResponse = exception.getResponse();
      const statusCode = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorCode =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).errorCode
          : statusCode;

      const errorResponse = {
        status: 'Error',
        statusCode,
        errorCode,
        message:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any).message
            : exceptionResponse,
        payload:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any).payload
            : null,
      };

      this._logger.formattedError(
        `${request.method} ${request.url} : ${exception.getResponse()}`,
        exception,
        {
          httpContext: ctx,
          errorResponse,
          contextName: this.contextName,
        },
      );

      return response.status(statusCode).json(errorResponse);
    } else {
      // GRAPHQL Exception
      // const gqlHost = GqlArgumentsHost.create(host);
      return exception;
    }
  }
}
