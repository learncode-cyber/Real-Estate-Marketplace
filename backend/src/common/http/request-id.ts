import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';
const VALID_INCOMING_ID = /^[A-Za-z0-9-]{8,64}$/;

/**
 * Attaches a request ID to every request and response. An incoming ID is reused only if it
 * matches a strict, short alphanumeric shape; otherwise a fresh UUID is generated.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header(REQUEST_ID_HEADER);
  const requestId =
    incoming !== undefined && VALID_INCOMING_ID.test(incoming) ? incoming : randomUUID();
  res.locals['requestId'] = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  next();
}
