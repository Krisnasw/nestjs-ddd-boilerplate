import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Request, Response } from 'express';

import { LoggerService } from '../shared/services/logger.service';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger: LoggerService) {}

  catch(_exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = i18n.t('error.NOT_FOUND');
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    const statusCode = _exception.getStatus
      ? _exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorCode =
      typeof response === 'object' ? (response as any).errorCode : statusCode;
    let detail = (_exception as any).message.message;

    if (request) {
      switch (_exception.constructor) {
        case NotFoundException:
          code = HttpStatus.NOT_FOUND;
          detail = (_exception as NotFoundException).message;
          break;
        default:
          code = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      const errorResponse = {
        status: 'Error',
        statusCode: _exception.getStatus,
        errorCode: code,
        message,
        detail,
        payload:
          typeof response === 'object' ? (response as any).payload : null,
      };

      return response.status(code).send(errorResponse);
    } else {
      return _exception;
    }
  }
}
