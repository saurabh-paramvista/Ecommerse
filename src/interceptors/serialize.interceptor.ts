import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';

export function SerializeIncludes(dto:any)
{
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto:any) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          exposeUnsetFields: true,
        });
      }),
    );
  }
}
