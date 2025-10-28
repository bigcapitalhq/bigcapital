import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { mapValues, mapValuesDeep } from '@/utils/deepdash';

@Injectable()
export class ToJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return mapValuesDeep(data, (value) => {
          if (value && typeof value.toJSON === 'function') {
            return value.toJSON();
          }
          return value;
        });
      }),
    );
  }
}
