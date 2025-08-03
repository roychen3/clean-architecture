import { useMe } from '@/hooks/me/use-me';

import { Container } from '@/components/container';

import { ProfileForm } from './_components/profile-form';
import { ChangePasswordForm } from './_components/change-password-form';
import { DangerZone } from './_components/danger-zone';
import { ChangePasswordFormSkeleton } from './_components/change-password-form-skeleton';
import { DangerZoneSkeleton } from './_components/danger-zone-skeleton';
import { ProfileFormSkeleton } from './_components/profile-form-skeleton';

const ProfilesPage = () => {
  const { data, status: meStatus, error: meError } = useMe();
  const me = data?.data;
  const isPending = meStatus === 'pending';

  if (meStatus === 'error' || !me)
    return (
      <Container className="text-destructive">
        {meError instanceof Error ? meError.message : 'Failed to load profile.'}
      </Container>
    );

  return (
    <Container className="space-y-10">
      {isPending ? (
        <ProfileFormSkeleton />
      ) : (
        <ProfileForm email={me.email} name={me.name} />
      )}
      {isPending ? <ChangePasswordFormSkeleton /> : <ChangePasswordForm />}
      {isPending ? <DangerZoneSkeleton /> : <DangerZone />}
    </Container>
  );
};

export default ProfilesPage;
