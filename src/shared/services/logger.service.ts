import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { SettingService } from './setting.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly _logger: winston.Logger;

  constructor(private readonly _configService: SettingService) {
    super(LoggerService.name, {
      timestamp: true,
      logLevels: _configService.log.levels,
    });
    this._logger = winston.createLogger(_configService.winstonConfig);
    if (_configService.nodeEnv !== 'production') {
      this._logger.debug('Logging initialized at debug level');
    }
  }
  log(message: string): void {
    this._logger.info(message);
  }
  info(message: string): void {
    this._logger.info(message);
  }
  debug(message: string): void {
    this._logger.debug(message);
  }
  error(message: string, trace?: any, context?: string): void {
    // i think the trace should be JSON Stringified
    this._logger.error(
      `${context || ''} ${message} -> (${
        trace || trace || trace || trace || trace || 'trace not provided !'
      })`,
    );
  }

  formattedError(
    message: string,
    error,
    meta: {
      httpContext: HttpArgumentsHost;
      errorResponse;
      contextName: string;
    },
  ) {
    const response = meta.httpContext.getResponse<Response>();
    const request = meta.httpContext.getRequest<Request>();
    const formatted = {
      headers: request.headers,
      body: request.body,
      responseMessage: meta.errorResponse,
      error,
    };
    this._logger.error(`${meta.contextName || ''} ${message}`, formatted);
  }

  warn(message: string): void {
    this._logger.warn(message);
  }
}
