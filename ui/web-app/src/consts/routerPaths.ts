export type RouterPathConfig = {
  type: 'public' | 'guestOnly' | 'protected';
  pathname: string;
  action?: string;
  resource?: string;
};

export const routerPathConfig = {
  home: {
    type: 'public',
    pathname: '/',
  },

  signUp: {
    type: 'guestOnly',
    pathname: '/sign-up',
  },
  signIn: {
    type: 'guestOnly',
    pathname: '/sign-in',
  },

  users: {
    type: 'protected',
    pathname: '/users',
    action: 'read',
    resource: 'users',
  },
  usersCreate: {
    type: 'protected',
    pathname: '/users/create',
    action: 'create',
    resource: 'users',
  },
  usersEdit: {
    type: 'protected',
    pathname: '/users/:userId/edit',
    action: 'update',
    resource: 'users',
  },

  roles: {
    type: 'protected',
    pathname: '/roles',
    action: 'read',
    resource: 'roles',
  },
  rolesCreate: {
    type: 'protected',
    pathname: '/roles/create',
    action: 'create',
    resource: 'roles',
  },
  rolesEdit: {
    type: 'protected',
    pathname: '/roles/:roleId/edit',
    action: 'update',
    resource: 'roles',
  },

  profiles: {
    type: 'protected',
    pathname: '/profiles',
    action: 'read',
    resource: 'me',
  },

  articles: {
    type: 'public',
    pathname: '/articles',
    action: 'read',
    resource: 'articles',
  },
  articlesCreate: {
    type: 'protected',
    pathname: '/articles/create',
    action: 'create',
    resource: 'articles',
  },
  articlesDetail: {
    type: 'public',
    pathname: '/articles/:articleId',
    action: 'read',
    resource: 'articles',
  },
  articlesEdit: {
    type: 'protected',
    pathname: '/articles/edit/:articleId',
    action: 'update',
    resource: 'articles',
  },
} satisfies Record<string, RouterPathConfig>;

export const routerPathConfigList = Object.entries(routerPathConfig).map(
  ([key, value]) => ({
    ...value,
    key,
  }),
);

export const publicRouterPathConfigList = routerPathConfigList.filter(
  (r) => r.type === 'public',
);

export const guestOnlyRouterPathConfigList = routerPathConfigList.filter(
  (r) => r.type === 'guestOnly',
);

export const protectedRouterPathConfigList = routerPathConfigList.filter(
  (r) => r.type === 'protected',
);

export const permissionRouterPathConfigList = routerPathConfigList.filter(
  (r): r is typeof r & { action: string; resource: string } =>
    'action' in r &&
    'resource' in r &&
    typeof r.action === 'string' &&
    typeof r.resource === 'string',
);
