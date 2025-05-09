import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceError } from '@/modules/Items/ServiceError';

@Catch(ServiceError)
export class ServiceErrorFilter implements ExceptionFilter {
  catch(exception: ServiceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      errors: [
        {
          statusCode: status,
          type: exception.errorType,
          message: exception.message,
          payload: exception.payload,
        }
      ]
    });
  }
}
