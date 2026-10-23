import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorBody } from '@property-platform/shared-types';

const STATUS_CODES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'UNAVAILABLE',
};

/**
 * Converts every error into the standard envelope (PLANNING.md section 9). Internal error
 * details are logged server-side and never returned to the client.
 */
@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpError');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const requestId = res.locals['requestId'] as string | undefined;

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = STATUS_CODES[status] ?? (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED');
    const message =
      status >= 500
        ? 'An unexpected error occurred.'
        : exception instanceof HttpException
          ? safeMessage(exception)
          : 'Request failed.';

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.path} failed (requestId=${requestId ?? 'none'})`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorBody = { error: { code, message, requestId } };
    res.status(status).json(body);
  }
}

function safeMessage(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'string') return response;
  if (typeof response === 'object' && response !== null && 'message' in response) {
    const value = response.message;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join('; ');
  }
  return 'Request failed.';
}
