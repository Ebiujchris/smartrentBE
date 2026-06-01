import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log error details (but don't expose to client)
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Sanitize error response - never expose sensitive data
    const sanitizedMessage = this.sanitizeErrorMessage(message);
    const sanitizedError = this.sanitizeErrorMessage(error);

    // Don't expose stack traces or internal details in production
    const errorResponse: any = {
      statusCode: status,
      message: sanitizedMessage,
      error: sanitizedError,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Only include stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private sanitizeErrorMessage(message: string | string[]): string | string[] {
    if (Array.isArray(message)) {
      return message.map((m) => this.sanitizeSingleMessage(m));
    }
    return this.sanitizeSingleMessage(message);
  }

  private sanitizeSingleMessage(message: string): string {
    // Remove sensitive patterns from error messages
    const sensitivePatterns = [
      /password/gi,
      /token/gi,
      /secret/gi,
      /api[_-]?key/gi,
      /database/gi,
      /connection/gi,
      /prisma/gi,
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email in error
    ];

    let sanitized = message;
    sensitivePatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }
}
