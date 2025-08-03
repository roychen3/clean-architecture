import { HttpAuthAPI } from './auth/implements/http-auth-api';
import type { AuthAPI } from './auth/interfaces';

import { HttpUsersAPI } from './users/implements/http-users-api';
import type { UsersAPI } from './users/interfaces';

import { HttpMeAPI } from './me/implements/http-me-api';
import type { MeAPI } from './me/interfaces';

import { HttpArticlesAPI } from './articles/implements/http-articles-api';
import type { ArticlesAPI } from './articles/interfaces';

import { HttpRolesAPI } from './roles/implements/http-roles-api';
import type { RolesAPI } from './roles/interfaces';

import { HttpRolePermissionsAPI } from './role-permissions/implements/http-role-permissions-api';
import type { RolePermissionsAPI } from './role-permissions/interface';

export class APIServiceFactory {
  static createAuthAPI(): AuthAPI {
    return new HttpAuthAPI();
  }

  static createUsersAPI(): UsersAPI {
    return new HttpUsersAPI();
  }

  static createMeAPI(): MeAPI {
    return new HttpMeAPI();
  }

  static createArticlesAPI(): ArticlesAPI {
    return new HttpArticlesAPI();
  }

  static createRolesAPI(): RolesAPI {
    return new HttpRolesAPI();
  }

  static createRolePermissionsAPI(): RolePermissionsAPI {
    return new HttpRolePermissionsAPI();
  }
}
