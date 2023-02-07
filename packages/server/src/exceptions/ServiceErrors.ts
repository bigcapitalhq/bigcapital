import ServiceError from './ServiceError';

export default class ServiceErrors {
  errors: ServiceError[];

  constructor(errors: ServiceError[]) {
    this.errors = errors;
  }

  hasType(errorType: string) {
    return this.errors.some(
      (error: ServiceError) => error.errorType === errorType
    );
  }
}
