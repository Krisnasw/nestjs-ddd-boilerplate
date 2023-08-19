'use strict';

import { NotImplementedException } from '@nestjs/common';

export class QueryRunnerException extends NotImplementedException {
  constructor(error?: string) {
    super('Something went wrong', error);
  }
}
