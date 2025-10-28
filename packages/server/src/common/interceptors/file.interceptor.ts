import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import * as multer from 'multer';
import { Observable } from 'rxjs';
import { MULTER_MODULE_OPTIONS } from '../constants/files.constants';
import { transformException } from '../constants/multer.utils';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

type MulterInstance = any;
/**
 * @param {string} fieldName
 * @param {Function|MulterOptions} localOptions - Function that receives controller instance or MulterOptions object
 */
export function FileInterceptor(
  fieldName: string,
  localOptions?: ((instance: any) => MulterOptions) | MulterOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: (() => MulterModuleOptions | MulterModuleOptions) = () => ({}),
    ) {
      const resolvedOptions = typeof localOptions === 'function' 
        ? localOptions(this)
        : localOptions;
        
      this.multer = (multer as any)({
        ...(typeof options === 'function' ? options() : options),
        ...resolvedOptions,
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (err: any) => {
            if (err) {
              const error = transformException(err);
              return reject(error);
            }
            resolve();
          },
        ),
      );
      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}