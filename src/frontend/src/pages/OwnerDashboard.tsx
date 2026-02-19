import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, UserPlus, Shield, Home, Megaphone, LayoutGrid } from 'lucide-react';
import { useGetUserBuilding, useGetCallerUserProfile, useGetInviteCodes } from '@/hooks/useQueries';
import InviteCodePanel from '@/components/InviteCodePanel';
import BuildingUsersList from '@/components/BuildingUsersList';
import ApartmentCreateForm from '@/components/ApartmentCreateForm';
import ApartmentsList from '@/components/ApartmentsList';
import AnnouncementCreateForm from '@/components/AnnouncementCreateForm';
import AnnouncementsList from '@/components/AnnouncementsList';
import DaireGorunumu from '@/components/DaireGorunumu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';

export default function OwnerDashboard() {
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: inviteCodes } = useGetInviteCodes();

  const totalInviteCodes = inviteCodes?.length || 0;
  const usedInviteCodes = inviteCodes?.filter(code => code.kullanildiMi).length || 0;
  const activeInviteCodes = totalInviteCodes - usedInviteCodes;
  const totalMembers = 1 + usedInviteCodes;

  if (buildingLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
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
            <h1 className="text-3xl font-bold tracking-tight">Bina Yönetim Paneli</h1>
            <p className="text-muted-foreground">
              Hoş geldiniz, {userProfile?.name || 'Bina Sahibi'}
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
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {building?.binaAdi}
          </CardTitle>
          <CardDescription>
            Bina yönetim sisteminiz aktif ve çalışıyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Oluşturulma Tarihi</p>
              <p className="text-sm font-medium">
                {building && new Date(Number(building.olusturulmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Toplam Üye</p>
              <p className="text-sm font-medium">{totalMembers} Kullanıcı</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Üyeler</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Aktif kullanıcı sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Davet Kodları</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInviteCodes}</div>
            <p className="text-xs text-muted-foreground">
              Kullanılabilir davet kodu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Durumu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Aktif</div>
            <p className="text-xs text-muted-foreground">
              Tüm sistemler çalışıyor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: User List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Kullanıcı Listesi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Binaya kayıtlı tüm kullanıcıları görüntüleyin
          </p>
        </div>
        <BuildingUsersList />
      </div>

      {/* Section 2: Invite Code Management */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Davet Kodu Yönetimi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Yeni kullanıcıları binaya davet etmek için kod oluşturun
          </p>
        </div>
        <InviteCodePanel />
      </div>

      {/* Section 3: Apartment Management */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Daire Yönetimi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Binadaki daireleri yönetin
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ApartmentCreateForm />
          <ApartmentsList />
        </div>
      </div>

      {/* Section 4: Apartment Visualization */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Daire Görünümü
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tüm dairelerin görsel durumu ve doluluk bilgisi
          </p>
        </div>
        <DaireGorunumu />
      </div>

      {/* Section 5: Announcement Management */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Duyuru Yönetimi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tüm kullanıcılara duyuru gönderin
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <AnnouncementCreateForm />
          <AnnouncementsList />
        </div>
      </div>
    </div>
  );
}
