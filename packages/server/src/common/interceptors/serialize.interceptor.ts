import {
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  type CallHandler,
  Optional,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function camelToSnake<T = any>(value: T) {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(camelToSnake);
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key
          .split(/(?=[A-Z])/)
          .join('_')
          .toLowerCase(),
        camelToSnake(value),
      ]),
    );
  }
  return value;
}

export function snakeToCamel<T = any>(value: T) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  }

  const impl = (str: string) => {
    const converted = str.replace(/([-_]\w)/g, (group) =>
      group[1].toUpperCase(),
    );
    return converted[0].toLowerCase() + converted.slice(1);
  };

  if (typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        impl(key),
        snakeToCamel(value),
      ]),
    );
  }
  return value;
}

export const DEFAULT_STRATEGY = {
  in: snakeToCamel,
  out: camelToSnake,
};

@Injectable()
export class SerializeInterceptor implements NestInterceptor<any, any> {
  constructor(@Optional() readonly strategy = DEFAULT_STRATEGY) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.body = this.strategy.in(request.body);

    // handle returns stream..
    return next.handle().pipe(map(this.strategy.out));
  }
}
