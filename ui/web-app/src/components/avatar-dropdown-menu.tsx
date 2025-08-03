import { useNavigate } from 'react-router';
import { UserRound } from 'lucide-react';

import { routerPathConfig } from '@/consts/routerPaths';

import { useSignOut } from '@/hooks/auth/use-sign-out';
import { useMe } from '@/hooks/me/use-me';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function AvatarDropdownMenu() {
  const navigate = useNavigate();

  const me = useMe();
  const selfName = me.data?.data.name;
  const selfId = me.data?.data.id;
  const { mutateAsync: signOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{selfName}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            navigate(routerPathConfig.profiles.pathname);
          }}
        >
          Profiles
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            if (!selfId) return;
            const searchParams = new URLSearchParams({
              'author-id': selfId,
            });
            navigate({
              pathname: routerPathConfig.articles.pathname,
              search: '?' + searchParams.toString(),
            });
          }}
        >
          My Articles
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            if (!selfId) return;

            navigate({
              pathname: routerPathConfig.users.pathname,
            });
          }}
        >
          User Management
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            if (!selfId) return;

            navigate({
              pathname: routerPathConfig.roles.pathname,
            });
          }}
        >
          Role Management
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AvatarDropdownMenu };
