import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ModelHasRelationsError } from '../exceptions/ModelHasRelations.exception';

@Catch(ModelHasRelationsError)
export class ModelHasRelationsFilter implements ExceptionFilter {
  catch(exception: ModelHasRelationsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.CONFLICT;

    response.status(status).json({
      errors: [
        {
          statusCode: status,
          type: exception.type || 'MODEL_HAS_RELATIONS',
          message: exception.message,
        },
      ],
    });
  }
}
