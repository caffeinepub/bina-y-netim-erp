import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, AlertCircle, Shield } from 'lucide-react';
import { useGetUserBuilding, useGetCallerUserProfile, useGetInviteCodes } from '@/hooks/useQueries';
import InviteCodePanel from '@/components/InviteCodePanel';
import IssuesList from '@/components/IssuesList';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Role } from '@/backend';

export default function ManagerDashboard() {
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: inviteCodes } = useGetInviteCodes();

  const totalInviteCodes = inviteCodes?.length || 0;
  const usedInviteCodes = inviteCodes?.filter(code => code.kullanildiMi).length || 0;
  const activeInviteCodes = totalInviteCodes - usedInviteCodes;

  if (buildingLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yetkili Paneli</h1>
            <p className="text-muted-foreground">
              Hoş geldiniz, {userProfile?.name || 'Yetkili'}
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
      <Card className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            {building?.binaAdi}
          </CardTitle>
          <CardDescription>
            Yetkili olarak yönetim görevlerinizi buradan gerçekleştirebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rolünüz</p>
              <p className="text-sm font-medium">Yetkili Kullanıcı</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Aktif Davet Kodları</p>
              <p className="text-sm font-medium">{activeInviteCodes} Kod</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sakin Davet Kodları</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInviteCodes}</div>
            <p className="text-xs text-muted-foreground">
              Kullanılabilir sakin davet kodu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Açık Arızalar</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Bekleyen arıza yok
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 lg:grid-cols-1 space-y-6">
        {/* Sakin Davet Yönetimi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Sakin Davet Yönetimi
            </CardTitle>
            <CardDescription>
              Yeni sakinleri binaya davet etmek için kod oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteCodePanel allowedRoles={[Role.sakin]} />
          </CardContent>
        </Card>

        {/* Açık Arızalar */}
        <IssuesList />
      </div>

      {/* Restrictions Notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            Yetki Kısıtlamaları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Yetkili kullanıcı davet edemezsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Bina ayarlarını görüntüleyemez ve değiştiremezsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Sakin kullanıcı davet edebilirsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Arıza ve görev yönetimi yapabilirsiniz</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
