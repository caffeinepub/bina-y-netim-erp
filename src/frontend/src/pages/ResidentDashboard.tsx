import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Bell, Shield } from 'lucide-react';
import { useGetUserBuilding, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import AnnouncementsList from '@/components/AnnouncementsList';
import IssueReportForm from '@/components/IssueReportForm';

export default function ResidentDashboard() {
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  if (buildingLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sakin Paneli</h1>
            <p className="text-muted-foreground">
              Hoş geldiniz, {userProfile?.name || 'Sakin'}
            </p>
          </div>
          {userProfile && (
            <Badge variant={getRoleVariant(userProfile.role)} className="text-sm">
              <Shield className="w-3 h-3 mr-1" />
              {getRoleDisplayName(userProfile.role)}
            </Badge>
          )}
        </div>
      </div>

      {/* Building Overview */}
      <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-background border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            {building?.binaAdi}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rolünüz</p>
              <p className="text-sm font-medium">Sakin</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Üyelik Tarihi</p>
              <p className="text-sm font-medium">
                {userProfile && new Date(Number(userProfile.firstLogin) / 1000000).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Duyurular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsList />
        </CardContent>
      </Card>

      {/* Issue Reporting Section */}
      <IssueReportForm />
    </div>
  );
}
