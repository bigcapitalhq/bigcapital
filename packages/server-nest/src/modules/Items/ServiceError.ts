import { HttpStatus } from '@nestjs/common';

export class ServiceError extends Error {
  errorType: string;
  message: string;
  payload: any;

  constructor(errorType: string, message?: string, payload?: any) {
    super(message);

    this.errorType = errorType;
    this.message = message || null;
    this.payload = payload;
  }

  getStatus(): HttpStatus {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
