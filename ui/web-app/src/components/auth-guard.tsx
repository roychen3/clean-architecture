import { useStore } from '@tanstack/react-store';
import { Navigate, useLocation, matchPath } from 'react-router';

import {
  routerPathConfig,
  publicRouterPathConfigList,
  guestOnlyRouterPathConfigList,
  protectedRouterPathConfigList,
} from '@/consts/routerPaths';
import { authStore } from '@/store/auth-store';

const publicPaths: string[] = publicRouterPathConfigList.map((r) => r.pathname);
const guestOnlyPaths: string[] = guestOnlyRouterPathConfigList.map(
  (r) => r.pathname,
);
const protectPaths: string[] = protectedRouterPathConfigList.map(
  (r) => r.pathname,
);

const isPathMatch = (paths: string[], pathname: string) =>
  paths.some((path) => matchPath(path, pathname));

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated);
  const { pathname } = useLocation();

  if (
    !isPathMatch(protectPaths, pathname) &&
    isPathMatch(publicPaths, pathname)
  ) {
    return <>{children}</>;
  }

  if (isPathMatch(guestOnlyPaths, pathname)) {
    return isAuthenticated ? (
      <Navigate to={routerPathConfig.home} replace />
    ) : (
      <>{children}</>
    );
  }

  if (isPathMatch(protectPaths, pathname)) {
    return isAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to={routerPathConfig.signIn} replace />
    );
  }

  return <h1>Path not defined in App</h1>;
}
