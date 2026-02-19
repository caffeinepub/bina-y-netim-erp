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
      console.log('Home: Checking onboarding flow, profileFetched=', profileFetched, 'hasBuilding=', hasBuilding, 'flow=', flow);
      
      if (flow === 'building-owner' || flow === 'authority' || flow === 'resident') {
        console.log('Home: Setting onboarding mode to', flow);
        setOnboardingMode(flow);
        clearOnboardingFlow();
        console.log('Home: Cleared onboarding flow from storage');
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
    console.log('Home: Rendering onboarding section, mode=', onboardingMode);
    
    // If onboarding mode is set, show the specific flow
    if (onboardingMode === 'building-owner') {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Hoş Geldiniz! Bina Oluşturun</CardTitle>
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
              <CardTitle className="text-2xl">Yetkili Olarak Katılın</CardTitle>
              <CardDescription>
                Bina yöneticisinden aldığınız YETKILI davet kodunu girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteCodeRegistration 
                onSuccess={handleInviteCodeSuccess}
                suggestedRole={Role.yetkili}
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
              <CardTitle className="text-2xl">Sakin Olarak Katılın</CardTitle>
              <CardDescription>
                Bina yöneticisinden aldığınız SAKIN davet kodunu girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteCodeRegistration 
                onSuccess={handleInviteCodeSuccess}
                suggestedRole={Role.sakin}
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default onboarding view when no specific mode is set
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Hoş Geldiniz!</CardTitle>
            <CardDescription>
              Başlamak için bir bina oluşturun veya davet kodu ile katılın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Bina Oluştur
                  </CardTitle>
                  <CardDescription>
                    Yeni bir bina oluşturun ve yönetmeye başlayın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Bina Oluştur
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Davet Kodu ile Katıl
                  </CardTitle>
                  <CardDescription>
                    Mevcut bir binaya davet kodu ile katılın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InviteCodeRegistration onSuccess={handleInviteCodeSuccess} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (profileLoading || buildingLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // Show onboarding if user doesn't have a building
  if (!hasBuilding) {
    return (
      <div className="container mx-auto p-6">
        {renderOnboardingSection()}
      </div>
    );
  }

  // Main dashboard for users with buildings
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HomeIcon className="h-8 w-8 text-primary" />
            Ana Sayfa
          </h1>
          <p className="text-muted-foreground mt-1">
            Bina yönetim sisteminize hoş geldiniz
          </p>
        </div>
      </div>

      {/* Building Info Card */}
      {renderRoleBasedContent()}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Davet Kodları</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInviteCodes}</div>
            <p className="text-xs text-muted-foreground">
              Kullanılabilir davet kodu
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanılan Kodlar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedInviteCodes}</div>
            <p className="text-xs text-muted-foreground">
              Toplam {totalInviteCodes} koddan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invite Code Management - Only for BINA_SAHIBI and YETKILI */}
      {canCreateInviteCodes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Davet Kodu Yönetimi
            </CardTitle>
            <CardDescription>
              Yeni kullanıcılar için davet kodları oluşturun ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteCodePanel />
          </CardContent>
        </Card>
      )}

      {/* Building Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Yeni Bina Oluştur</CardTitle>
              <CardDescription>
                Bina bilgilerini girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BuildingCreateForm onSuccess={handleCreateSuccess} />
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="w-full mt-4"
              >
                İptal
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
