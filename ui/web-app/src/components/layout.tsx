import { useNavigate, Link } from 'react-router';
import { useStore } from '@tanstack/react-store';

import { routerPathConfig } from '@/consts/routerPaths';
import { authStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AvatarDropdownMenu } from './avatar-dropdown-menu';
import { TypographyH3 } from './typography';
import { Container } from './container';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b">
        <Container className="py-2 flex justify-between items-center">
          <Link
            className="text-2xl font-bold"
            to={routerPathConfig.home.pathname}
          >
            <TypographyH3>CA</TypographyH3>
          </Link>
          <nav className="flex gap-4">
            {isAuthenticated ? (
              <AvatarDropdownMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate(routerPathConfig.signIn.pathname);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate(routerPathConfig.signUp.pathname);
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </nav>
        </Container>
      </header>
      <Separator />
      <main className="flex-1 flex">{children}</main>
      <Separator />
      <footer className="w-full text-center text-sm text-muted-foreground border-t">
        <Container className="py-2">
          © {new Date().getFullYear()} CA. All rights reserved.
        </Container>
      </footer>
    </div>
  );
}

export { Layout };
