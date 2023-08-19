'use strict';

import { format, utcToZonedTime } from 'date-fns-tz';
import { Injectable } from '@nestjs/common/decorators';
import { RequestContext } from '@medibloc/nestjs-request-context';
import { Exclude, Expose, Transform } from 'class-transformer';
import { AbstractRequestContext } from '../contexts/abstract-request.context';

@Exclude()
@Injectable()
export class AbstractDto {
    @Expose()
    id!: string;

    @Expose()
    @Transform(({ value }) => {
        const ctx: AbstractRequestContext = RequestContext.get();
        return value
            ? format(ctx?.timezone ? utcToZonedTime(new Date(value), ctx?.timezone) : new Date(value), 'yyyy-MM-dd HH:mm:ss')
            : null;
    })
    createdAt?: Date;

    @Expose()
    @Transform(({ value }) => {
        const ctx: AbstractRequestContext = RequestContext.get();
        return value
            ? format(ctx?.timezone ? utcToZonedTime(new Date(value), ctx?.timezone) : new Date(value), 'yyyy-MM-dd HH:mm:ss')
            : null;
    })
    updatedAt?: Date;

    @Expose()
    @Transform(({ value }) => {
        if (value) {
            const ctx: AbstractRequestContext = RequestContext.get();
            return value
                ? format(ctx?.timezone ? utcToZonedTime(new Date(value), ctx?.timezone) : new Date(value), 'yyyy-MM-dd HH:mm:ss')
                : null;
        }
        return value;
    })
    deletedAt?: Date;
}