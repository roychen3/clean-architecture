import { useParams } from 'react-router';

import { Container } from '@/components/container';

import { UserEditForm } from './_components/user-edit-form';
import { UserRoleManager } from './_components/user-role-manager';

const UsersEditPage = () => {
  const { userId } = useParams<{ userId: string }>();
  if (!userId)
    return (
      <Container className="text-muted-foreground">User not found</Container>
    );
  return (
    <Container className="space-y-12">
      <UserEditForm userId={userId} />
      <UserRoleManager userId={userId} />
    </Container>
  );
};

export default UsersEditPage;
