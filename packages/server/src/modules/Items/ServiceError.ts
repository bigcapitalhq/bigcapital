import { HttpStatus } from '@nestjs/common';

export class ServiceError extends Error {
  errorType: string;
  message: string;
  payload: any;
  httpStatus: HttpStatus;

  constructor(errorType: string, message?: string, payload?: any, httpStatus?: HttpStatus) {
    super(message);

    this.errorType = errorType;
    this.message = message || null;
    this.payload = payload;
    this.httpStatus = httpStatus || HttpStatus.BAD_REQUEST;
  }

  getStatus(): HttpStatus {
    return this.httpStatus;
  }
}
