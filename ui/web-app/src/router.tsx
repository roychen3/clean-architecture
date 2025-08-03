import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { AuthGuard } from '@/components/auth-guard';
import { PermissionsGuard } from '@/components/permission-guard';
import { Layout } from '@/components/layout';
import { UnsaveLeaveBlockerProvider } from '@/components/unsave-leave-blocker-provider';

const HomePage = lazy(() => import('@/pages/home'));
const SignUp = lazy(() => import('@/pages/sign-up'));
const SignIn = lazy(() => import('@/pages/sign-in'));
const UsersPage = lazy(() => import('@/pages/users'));
const UsersCreatePage = lazy(() => import('@/pages/users/create'));
const UsersEditPage = lazy(() => import('@/pages/users/edit'));
const RolesPage = lazy(() => import('@/pages/roles'));
const RolesCreatePage = lazy(() => import('@/pages/roles/create'));
const RoleEditPage = lazy(() => import('@/pages/roles/edit'));
const ProfilesPage = lazy(() => import('@/pages/profiles'));
const ArticleListPage = lazy(() => import('@/pages/articles'));
const ArticleCreatePage = lazy(() => import('@/pages/articles/create'));
const ArticleDetailPage = lazy(() => import('@/pages/articles/detail'));
const ArticleEditPage = lazy(() => import('@/pages/articles/edit'));

export const router = createBrowserRouter([
  {
    element: (
      <UnsaveLeaveBlockerProvider>
        <Layout>
          <AuthGuard>
            <PermissionsGuard>
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </PermissionsGuard>
          </AuthGuard>
        </Layout>
      </UnsaveLeaveBlockerProvider>
    ),
    children: [
      {
        path: routerPathConfig.home.pathname,
        element: <HomePage />,
      },
      {
        path: routerPathConfig.signUp.pathname,
        element: <SignUp />,
      },
      {
        path: routerPathConfig.signIn.pathname,
        element: <SignIn />,
      },
      {
        path: routerPathConfig.users.pathname,
        element: <UsersPage />,
      },
      {
        path: routerPathConfig.usersCreate.pathname,
        element: <UsersCreatePage />,
      },
      {
        path: routerPathConfig.usersEdit.pathname,
        element: <UsersEditPage />,
      },
      {
        path: routerPathConfig.roles.pathname,
        element: <RolesPage />,
      },
      {
        path: routerPathConfig.rolesCreate.pathname,
        element: <RolesCreatePage />,
      },
      {
        path: routerPathConfig.rolesEdit.pathname,
        element: <RoleEditPage />,
      },
      {
        path: routerPathConfig.profiles.pathname,
        element: <ProfilesPage />,
      },
      {
        path: routerPathConfig.articles.pathname,
        element: <ArticleListPage />,
      },
      {
        path: routerPathConfig.articlesCreate.pathname,
        element: <ArticleCreatePage />,
      },
      {
        path: routerPathConfig.articlesDetail.pathname,
        element: <ArticleDetailPage />,
      },
      {
        path: routerPathConfig.articlesEdit.pathname,
        element: <ArticleEditPage />,
      },
    ],
  },
]);
