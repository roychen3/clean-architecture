import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { httpFetcher, type HttpFetcherError } from '@/lib/http-fetcher';
import { lockAsyncFn } from '@/lib/lock-async-fn.ts';
import { APIServiceFactory } from '@/api/factory.ts';
import { authStore } from '@/store/auth-store.ts';

import { APIError } from './errors.ts';

import './index.css';

const initialHttpFetcher = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  httpFetcher.defaults.baseURL = VITE_API_BASE_URL;
  httpFetcher.defaults.withCredentials = true;
  httpFetcher.interceptors.request.use((request) => {
    const accessToken = authStore.state.accessToken;
    request.headers['Authorization'] = accessToken
      ? `Bearer ${accessToken}`
      : undefined;
    return request;
  });
  const httpAuthAPI = APIServiceFactory.createAuthAPI();
  const lockRefreshToken = lockAsyncFn(
    httpAuthAPI.refreshToken.bind(httpAuthAPI),
  );
  httpFetcher.interceptors.response.use(
    (response) => response,
    async (error: HttpFetcherError) => {
      const originalRequest = {
        _retry: false,
        ...error.config,
      };

      if (error.response?.status === 401) {
        if (
          error.response?.data?.error.errorCode === 'TOKEN_EXPIRED' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await lockRefreshToken();
            authStore.setAccessToken(response.data.accessToken);
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] =
                `Bearer ${response.data.accessToken}`;
            }
            return await httpFetcher(originalRequest);
          } catch (refreshError) {
            authStore.setAccessToken(null);
            throw refreshError;
          }
        } else {
          authStore.setAccessToken(null);
        }
      }

      throw new APIError({
        message: error.response?.data.error.message || error.message,
        errorCode:
          error.response?.data.error.errorCode || error.code || 'UNKNOWN_ERROR',
        httpStatus: error.status || 500,
        cause: error,
      });
    },
  );
};

const renderReactApp = async () => {
  const App = (await import('./App.tsx')).default;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};
const main = async () => {
  initialHttpFetcher();
  await renderReactApp();
};
main().catch((error) => {
  console.error('Error initializing web app:', error);
});
