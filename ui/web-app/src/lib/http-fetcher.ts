import axios, {
  isAxiosError,
  AxiosError,
  type AxiosRequestConfig,
} from 'axios';

import type { ErrorResponse } from '@/api/types';

export function createHttpFetcher(config?: {
  baseURL?: string;
  Authorization?: string;
}) {
  const httpFetcher = axios.create({
    baseURL: config?.baseURL,
    headers: {
      Authorization: config?.Authorization,
    },
  });
  return httpFetcher;
}

export const isHttpFetcherError = isAxiosError;

export type HttpFetcher = ReturnType<typeof createHttpFetcher>;
export type HttpFetcherError = AxiosError<ErrorResponse>;
export type HttpFetcherRequestConfig = AxiosRequestConfig;

export const httpFetcher = createHttpFetcher();
