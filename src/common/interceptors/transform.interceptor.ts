import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Remove sensitive fields from response
        return this.sanitizeResponse(data);
      }),
    );
  }

  private sanitizeResponse(data: any): any {
    if (!data) return data;

    // Handle Prisma Decimal - check if it has toNumber method
    if (data && typeof data === 'object' && typeof data.toNumber === 'function') {
      return data.toNumber();
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponse(item));
    }

    // Handle objects
    if (typeof data === 'object') {
      const sanitized = { ...data };

      // Remove password fields
      if ('password' in sanitized) {
        delete sanitized.password;
      }

      // Remove internal IDs that shouldn't be exposed
      const internalFields = ['__v', '_id'];
      internalFields.forEach((field) => {
        if (field in sanitized) {
          delete sanitized[field];
        }
      });

      // Convert all fields recursively
      Object.keys(sanitized).forEach((key) => {
        sanitized[key] = this.sanitizeResponse(sanitized[key]);
      });

      return sanitized;
    }

    return data;
  }
}
