import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Users, Bell, Plus, TrendingUp, Activity } from 'lucide-react';
import { useGetUserBuilding, useGetCallerUserProfile, useGetInviteCodes } from '@/hooks/useQueries';
import BuildingCreateForm from '@/components/BuildingCreateForm';
import InviteCodePanel from '@/components/InviteCodePanel';
import InviteCodeRegistration from '@/components/InviteCodeRegistration';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Role } from '@/backend';
import { getOnboardingFlow, clearOnboardingFlow } from '@/utils/urlParams';

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<'building-owner' | 'authority' | 'resident' | null>(null);
  
  const { data: building, isLoading: buildingLoading, isFetched: buildingFetched, error: buildingError } = useGetUserBuilding();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: inviteCodes } = useGetInviteCodes();

  const hasBuilding = userProfile?.binaId !== null && userProfile?.binaId !== undefined;
  const userRole = userProfile?.role;
  const isBinaSahibi = userRole === Role.binaSahibi;
  const isYetkili = userRole === Role.yetkili;
  const isSakin = userRole === Role.sakin;

  // Determine if user can create invite codes (BINA_SAHIBI or YETKILI)
  const canCreateInviteCodes = isBinaSahibi || isYetkili;

  // Calculate statistics
  const totalInviteCodes = inviteCodes?.length || 0;
  const usedInviteCodes = inviteCodes?.filter(code => code.kullanildiMi).length || 0;
  const activeInviteCodes = totalInviteCodes - usedInviteCodes;
  const totalMembers = 1 + usedInviteCodes; // 1 for building owner + used codes

  // Check for onboarding flow on mount
  useEffect(() => {
    if (profileFetched && !hasBuilding) {
      const flow = getOnboardingFlow();
      if (flow === 'building-owner' || flow === 'authority' || flow === 'resident') {
        setOnboardingMode(flow);
        clearOnboardingFlow();
      }
    }
  }, [profileFetched, hasBuilding]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setOnboardingMode(null);
  };

  const handleInviteCodeSuccess = () => {
    setOnboardingMode(null);
  };

  // Role-based conditional rendering infrastructure
  const renderRoleBasedContent = () => {
    if (!userRole) {
      return null;
    }

    return (
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {building?.binaAdi}
            </CardTitle>
            {userProfile && (
              <Badge variant={getRoleVariant(userProfile.role)} className="text-sm">
                {getRoleDisplayName(userProfile.role)}
              </Badge>
            )}
          </div>
          <CardDescription>
            Bina yönetim sisteminiz aktif ve çalışıyor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          {canCreateInviteCodes && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Davet Kodları</p>
                  <p className="text-xs text-muted-foreground">
                    {activeInviteCodes} aktif, {usedInviteCodes} kullanılmış
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {totalInviteCodes}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Onboarding section for users without buildings
  const renderOnboardingSection = () => {
    // If onboarding mode is set, show the specific flow
    if (onboardingMode === 'building-owner') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Bina Oluştur</CardTitle>
              <CardDescription>
                Yeni bir bina oluşturun ve yönetmeye başlayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BuildingCreateForm onSuccess={handleCreateSuccess} />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (onboardingMode === 'authority') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Yetkili Olarak Katıl</CardTitle>
              <CardDescription>
                Davet kodunuzu girerek yetkili olarak binaya katılın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteCodeRegistration 
                suggestedRole={Role.yetkili}
                onSuccess={handleInviteCodeSuccess}
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (onboardingMode === 'resident') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Sakin/Personel Olarak Katıl</CardTitle>
              <CardDescription>
                Davet kodunuzu girerek binaya katılın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteCodeRegistration 
                suggestedRole={Role.sakin}
                onSuccess={handleInviteCodeSuccess}
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default onboarding view (no specific flow selected)
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
            <CardDescription>
              Bina yönetim sistemini kullanmaya başlamak için aşağıdaki seçeneklerden birini kullanın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Building Creation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Yeni Bina Oluştur</h3>
                  <p className="text-sm text-muted-foreground">
                    Kendi binanızı oluşturun ve yönetmeye başlayın
                  </p>
                </div>
              </div>
              {!showCreateForm ? (
                <Button onClick={() => setShowCreateForm(true)} className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Bina Oluştur
                </Button>
              ) : null}
            </div>

            {showCreateForm && (
              <BuildingCreateForm onSuccess={handleCreateSuccess} />
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">veya</span>
              </div>
            </div>

            {/* Invite Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Davet Kodu ile Katıl</h3>
                  <p className="text-sm text-muted-foreground">
                    Mevcut bir binaya davet kodu ile katılın
                  </p>
                </div>
              </div>

              <InviteCodeRegistration onSuccess={handleInviteCodeSuccess} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ana Sayfa</h1>
        <p className="text-muted-foreground mt-2">
          Bina yönetim sisteminizin genel görünümü
        </p>
      </div>

      {/* Loading State */}
      {(buildingLoading || profileLoading) && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {buildingError && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Hata</CardTitle>
            <CardDescription>
              Bina bilgileri yüklenirken bir hata oluştu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {buildingError instanceof Error ? buildingError.message : 'Bilinmeyen bir hata oluştu'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Conditional Rendering: Onboarding vs Dashboard */}
      {!buildingLoading && !profileLoading && profileFetched && (
        <>
          {!hasBuilding ? (
            renderOnboardingSection()
          ) : (
            <>
              {/* Building Status Section */}
              {building && renderRoleBasedContent()}

              {/* Invite Code Panel - Only for BINA_SAHIBI and YETKILI */}
              {canCreateInviteCodes && <InviteCodePanel />}

              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bina</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">Aktif bina</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground">Kayıtlı kullanıcı</p>
                    {usedInviteCodes > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+{usedInviteCodes} yeni</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Davet Kodları</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeInviteCodes}</div>
                    <p className="text-xs text-muted-foreground">Aktif kod</p>
                    {totalInviteCodes > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalInviteCodes} toplam
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sistem Durumu</CardTitle>
                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">✓</div>
                    <p className="text-xs text-muted-foreground">Tüm sistemler çalışıyor</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              {canCreateInviteCodes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                    <CardDescription>
                      Sık kullanılan işlemlere hızlı erişim
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                        <a href="/building-members">
                          <Users className="mr-3 h-5 w-5" />
                          <div className="text-left">
                            <p className="font-medium">Üyeleri Görüntüle</p>
                            <p className="text-xs text-muted-foreground">Tüm bina üyelerini listele</p>
                          </div>
                        </a>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                        <a href="/announcements">
                          <Bell className="mr-3 h-5 w-5" />
                          <div className="text-left">
                            <p className="font-medium">Duyurular</p>
                            <p className="text-xs text-muted-foreground">Duyuruları yönet</p>
                          </div>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
