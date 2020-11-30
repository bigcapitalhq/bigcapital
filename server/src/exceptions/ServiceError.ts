

export default class ServiceError {
  errorType: string;
  message: string;
  payload: any;

  constructor(errorType: string, message?: string, payload?: any) {
    this.errorType = errorType;
    this.message = message || null;

    this.payload = payload;
  }
}