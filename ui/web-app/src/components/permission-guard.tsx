import { useLocation, matchPath } from 'react-router';

import { permissionRouterPathConfigList } from '@/consts/routerPaths';

import { rolePermissionsStore } from '@/store/role-permissions-store';

import { TypographyH1 } from '@/components/typography';

import { Container } from './container';

const checkPermission = (pathname: string) => {
  const matchedConfig = permissionRouterPathConfigList.find((config) =>
    matchPath(config.pathname, pathname),
  );

  if (!matchedConfig) {
    return true; // If no config matches, allow access by default
  }

  return rolePermissionsStore.can(matchedConfig.action, matchedConfig.resource);
};
interface AuthGuardProps {
  children: React.ReactNode;
}

export function PermissionsGuard({ children }: AuthGuardProps) {
  const { pathname } = useLocation();

  if (checkPermission(pathname)) {
    return <>{children}</>;
  }
  return (
    <Container>
      <TypographyH1>Access Denied</TypographyH1>
    </Container>
  );
}
