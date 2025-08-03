import { useNavigate } from 'react-router';

import { routerPathConfig } from '@/consts/routerPaths';

import { useCreateRole } from '@/hooks/roles/use-create-role';

import { Container } from '@/components/container';
import { FormEditTitle } from '@/components/typography';

import { RoleForm, type RoleFormValues } from '../_components/role-form';

const RoleCreatePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: create } = useCreateRole();

  const onSubmit = async (data: RoleFormValues) => {
    await create({
      body: data,
    });
    navigate(routerPathConfig.roles.pathname);
  };

  return (
    <Container className="space-y-4">
      <FormEditTitle>Create User</FormEditTitle>
      <RoleForm onSubmit={onSubmit} submitLabel="Create" />
    </Container>
  );
};

export default RoleCreatePage;
