import {
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  type CallHandler,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapKeysDeep } from '@/utils/deepdash';
import { SKIP_SERIALIZE } from '../decorators/SkipSerialize.decorator';

export function camelToSnake<T = any>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  return mapKeysDeep(
    value,
    (_value: string, key: any, parent: any, context: any) => {
      if (Array.isArray(parent)) {
        // tell mapKeysDeep to skip mapping inside this branch
        context.skipChildren = true;
        return key;
      }
      return key
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase();
    },
  ) as T;
}

export function snakeToCamel<T = any>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  return mapKeysDeep(
    value,
    (_value: string, key: any, parent: any, context: any) => {
      if (Array.isArray(parent)) {
        // tell mapKeysDeep to skip mapping inside this branch
        context.skipChildren = true;
        return key;
      }
      const converted = key.replace(/([-_]\w)/g, (group) =>
        group[1].toUpperCase(),
      );
      return converted[0].toLowerCase() + converted.slice(1);
    },
  ) as T;
}

export const DEFAULT_STRATEGY = {
  in: snakeToCamel,
  out: camelToSnake,
};

@Injectable()
export class SerializeInterceptor implements NestInterceptor<any, any> {
  constructor(
    private readonly reflector: Reflector,
    @Optional() readonly strategy = DEFAULT_STRATEGY,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const skipSerialize = this.reflector.getAllAndOverride<boolean>(
      SKIP_SERIALIZE,
      [context.getHandler(), context.getClass()],
    );
    if (skipSerialize) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    // Transform both body and query parameters
    request.body = this.strategy.in(request.body);
    request.query = this.strategy.in(request.query);

    // handle returns stream..
    return next.handle().pipe(map(this.strategy.out));
  }
}
