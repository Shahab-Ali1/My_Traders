import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((body) => {
        try {
          return this.transformResponse(body);
        } catch (error) {
          Logger.error('Error in ResponseInterceptor:', error);
          throw new InternalServerErrorException('Internal server error');
        }
      }),
    );
  }

  private transformResponse(body: any): any {
    if (typeof body === 'string') {
      return body;
    }

    if (this.isNullOrUndefined(body)) {
      return this.createNotFoundResponse();
    }

    if (this.isPaginatedResponse(body)) {
      return this.createPaginatedResponse(body);
    }

    if (Array.isArray(body)) {
      return body;
    }

    return this.handleObjectResponse(body);
  }

  private isNullOrUndefined(body: any): boolean {
    return body === null || body === undefined;
  }

  private createNotFoundResponse(): object {
    return {
      status_code: 404,
      message: 'Not Found',
    };
  }

  private isPaginatedResponse(body: any): boolean {
    return body?.query && body?.total !== undefined;
  }

  private createPaginatedResponse(body: any): object {
    const pageSize = body.query.page_size || 10;
    const total = body.total || 0;

    return {
      data: body.data || [],
      total: total,
      page_number: parseInt(body.query.page_number) || 1,
      page_size: parseInt(pageSize),
      total_pages: Math.ceil(total / pageSize),
    };
  }

  private handleObjectResponse(body: any): any {
    if (typeof body === 'object' && body !== null) {
      if (body.data !== undefined) {
        return body.data;
      }
      return body;
    }
    return body;
  }
}