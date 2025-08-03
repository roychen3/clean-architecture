import { useParams } from 'react-router';

import { Container } from '@/components/container';

import { EditRoleForm } from './_components/edit-role-form';
import { RolePermissionsEditor } from './_components/role-permissions-editor';

const RoleEditPage = () => {
  const { roleId } = useParams<{ roleId: string }>();

  if (!roleId) return <div>Role not found.</div>;

  return (
    <Container className="space-y-4">
      <EditRoleForm roleId={roleId} />
      <RolePermissionsEditor roleId={roleId} />
    </Container>
  );
};

export default RoleEditPage;
