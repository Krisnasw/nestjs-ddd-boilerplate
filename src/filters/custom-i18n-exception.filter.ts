import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import {
  I18nContext,
  I18nValidationError,
  I18nValidationException,
} from 'nestjs-i18n';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';
import { Either } from 'nestjs-i18n/dist/types/either.type';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';

type I18nValidationExceptionFilterOptions = Either<
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption
>;

@Catch(I18nValidationException)
export class CustomI18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        const statusCode = exception.getStatus
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send({
            status: 'Error',
            statusCode:
              this.options.errorHttpStatusCode || exception.getStatus(),
            errorCode: 1000,
            message: exception.getResponse(),
            payload: this.propertyKeyValidationErrors(errors),
          });
        break;
      case 'graphql':
        exception.errors = this.normalizeValidationErrors(
          errors,
        ) as I18nValidationError[];
        return exception;
    }
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    switch (true) {
      case !this.options.detailedErrors && !('errorFormatter' in this.options):
        return this.flattenValidationErrors(validationErrors);
      case !this.options.detailedErrors && 'errorFormatter' in this.options:
        return this.options.errorFormatter(validationErrors);
      default:
        return validationErrors;
    }
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    const result = [];
    for (const key in validationErrors) {
      if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
        const item = validationErrors[key];
        if (!!item.constraints) {
          result.push(...Object.values(item.constraints));
        }
      }
    }
    return result;
  }

  protected propertyKeyValidationErrors(
    validationErrors: ValidationError[],
  ): object {
    const payload = {};
    for (const key in validationErrors) {
      if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
        const element = validationErrors[key];
        payload[element.property] = Object.values(element.constraints)[0];
      }
    }
    return payload;
  }
}
