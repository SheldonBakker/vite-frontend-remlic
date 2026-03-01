import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Shield, Calendar, Key, Trash2 } from 'lucide-react';
import { getProfile, type Profile } from '@/api/services/profileApi';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';
import { DeleteAccountDialog } from '@/components/profile/DeleteAccountDialog';
import { ErrorCard } from '@/components/ui/error-card';
import { PageHeader } from '@/components/ui/page-header';
import { InfoCard } from '@/components/profile/InfoCard';
import { AxiosError } from 'axios';

export default function ProfilePage(): React.JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error?.message ?? err.message);
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  if (!profile) {
    return <ErrorCard title="Profile Not Found" message="Unable to load your profile information." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account information and settings." />

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard icon={Mail} title="Email" value={profile.email} />
        <InfoCard icon={Phone} title="Phone" value={profile.phone || 'Not provided'} />
        <InfoCard icon={Shield} title="Role" value={profile.role} />
        <InfoCard icon={Calendar} title="Member Since" value={formatDate(profile.created_at)} />
      </div>

      <PageHeader title="Security" description="Manage your account security settings." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen(true)}>
                Change
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <PageHeader title="Danger Zone" description="Irreversible actions for your account." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-base">Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all data</CardDescription>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeleteAccountOpen(true)}>
                Delete
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        email={profile.email}
      />
    </div>
  );
}
