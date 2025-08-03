import type { HttpFetcherError } from '@/lib/http-fetcher';

export class APIError extends Error {
  httpStatus: number;
  errorCode: string;
  cause?: HttpFetcherError;

  constructor(options: {
    message: string;
    httpStatus: number;
    errorCode: string;
    cause?: HttpFetcherError;
  }) {
    super(options.message);
    this.httpStatus = options.httpStatus;
    this.errorCode = options.errorCode;
    this.cause = options.cause;
  }
}
