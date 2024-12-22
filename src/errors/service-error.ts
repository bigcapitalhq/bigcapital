import { HttpStatus } from '@nestjs/common';

export class ServiceError extends Error {
  constructor(
    public message: string,
    private status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
  }

  getStatus(): HttpStatus {
    return this.status;
  }
} 