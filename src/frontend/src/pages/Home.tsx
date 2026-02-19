import { useState, useEffect, useRef } from 'react';
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
  const hasSetModeRef = useRef(false);
  
  const { data: building, isLoading: buildingLoading, isFetched: buildingFetched, error: buildingError } = useGetUserBuilding();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: inviteCodes } = useGetInviteCodes();

  const hasBuilding = userProfile?.binaId !== null && userProfile?.binaId !== undefined;
  const userRole = userProfile?.role;
  const isBinaSahibi = userRole === Role.binaSahibi;
  const isYetkili = userRole === Role.yetkili;
  const isSakin = userRole === Role.sakin;

  console.log('Home: Render state', {
    profileLoading,
    profileFetched,
    hasProfile: !!userProfile,
    hasBuilding,
    userRole,
    onboardingMode,
  });

  // Determine if user can create invite codes (BINA_SAHIBI or YETKILI)
  const canCreateInviteCodes = isBinaSahibi || isYetkili;

  // Calculate statistics
  const totalInviteCodes = inviteCodes?.length || 0;
  const usedInviteCodes = inviteCodes?.filter(code => code.kullanildiMi).length || 0;
  const activeInviteCodes = totalInviteCodes - usedInviteCodes;
  const totalMembers = 1 + usedInviteCodes; // 1 for building owner + used codes

  // Phase 1: Retrieve onboarding flow from session storage and set it to state
  useEffect(() => {
    if (profileFetched && !hasBuilding && !hasSetModeRef.current) {
      const flow = getOnboardingFlow();
      console.log('Home: Checking onboarding flow, profileFetched=', profileFetched, 'hasBuilding=', hasBuilding, 'flow=', flow);
      
      if (flow === 'building-owner' || flow === 'authority' || flow === 'resident') {
        console.log('Home: Setting onboarding mode to', flow);
        setOnboardingMode(flow);
        hasSetModeRef.current = true;
      }
    }
  }, [profileFetched, hasBuilding]);

  // Phase 2: Clear session storage only after mode has been set and component has rendered
  useEffect(() => {
    if (onboardingMode !== null && hasSetModeRef.current) {
      console.log('Home: Mode is set to', onboardingMode, '- clearing session storage');
      clearOnboardingFlow();
      console.log('Home: Cleared onboarding flow from storage');
    }
  }, [onboardingMode]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setOnboardingMode(null);
    hasSetModeRef.current = false;
  };

  const handleInviteCodeSuccess = () => {
    setOnboardingMode(null);
    hasSetModeRef.current = false;
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
    // Defensive fallback: check session storage if mode is null
    const effectiveMode = onboardingMode || getOnboardingFlow();
    
    if (effectiveMode !== onboardingMode && effectiveMode) {
      console.log('Home: Using fallback mode from session storage:', effectiveMode);
    }
    
    console.log('Home: Rendering onboarding section, mode=', onboardingMode, 'effectiveMode=', effectiveMode);
    
    // If onboarding mode is set, show the specific flow
    if (effectiveMode === 'building-owner') {
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

    if (effectiveMode === 'authority') {
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

    if (effectiveMode === 'resident') {
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

        {showCreateForm && (
          <BuildingCreateForm onSuccess={handleCreateSuccess} />
        )}
      </div>
    );
  };

  if (profileLoading || buildingLoading) {
    console.log('Home: Showing loading skeleton');
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
    console.log('Home: No building, showing onboarding');
    return (
      <div className="container mx-auto p-6">
        {renderOnboardingSection()}
      </div>
    );
  }

  // Show role-based content if user has a building
  console.log('Home: Has building, showing role-based content');
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ana Sayfa</h1>
        <p className="text-muted-foreground">
          Bina yönetim sisteminize hoş geldiniz
        </p>
      </div>

      {renderRoleBasedContent()}

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

        {canCreateInviteCodes && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Davet Kodları</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeInviteCodes}</div>
              <p className="text-xs text-muted-foreground">
                Kullanılabilir davet kodu
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Durumu</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Aktif</div>
            <p className="text-xs text-muted-foreground">
              Tüm sistemler çalışıyor
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
