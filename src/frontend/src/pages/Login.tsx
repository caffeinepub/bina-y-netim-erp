import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Loader2, UserCog, Users } from 'lucide-react';
import { storeSessionParameter } from '@/utils/urlParams';

export default function Login() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleLogin = async (flowType: 'building-owner' | 'authority' | 'resident') => {
    // Store the selected onboarding flow before authentication
    storeSessionParameter('onboardingFlow', flowType);
    
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bina Yönetim ERP</h1>
            <p className="text-muted-foreground mt-2">
              Kullanıcı tipinizi seçin ve giriş yapın
            </p>
          </div>
        </div>

        {/* Three Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Building Owner Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-blue-500/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/generated/building-owner-icon.dim_128x128.png" 
                  alt="Bina Sahibi"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-xl">Bina Sahibi</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  Yeni bir bina oluşturun ve yönetmeye başlayın. Tüm yönetim yetkilerine sahip olun.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ Bina oluşturma</p>
                <p>✓ Davet kodu oluşturma</p>
                <p>✓ Tam yönetim yetkisi</p>
              </div>
              <Button
                onClick={() => handleLogin('building-owner')}
                disabled={isLoggingIn}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-5 w-5" />
                    Giriş Yap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Authority Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-purple-500/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/generated/authority-icon.dim_128x128.png" 
                  alt="Yetkili"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-xl">Yetkili</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  Bina yönetiminde yetkili olarak görev alın. Davet kodu ile katılın.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ Davet kodu ile katılma</p>
                <p>✓ Yönetim yetkileri</p>
                <p>✓ Davet kodu oluşturma</p>
              </div>
              <Button
                onClick={() => handleLogin('authority')}
                disabled={isLoggingIn}
                className="w-full h-12 text-base font-medium bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <UserCog className="mr-2 h-5 w-5" />
                    Giriş Yap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resident/Staff Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-green-500/50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 bg-green-50 dark:bg-green-950/30 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/generated/resident-icon.dim_128x128.png" 
                  alt="Sakin/Personel"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-xl">Sakin/Personel</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  Bina sakini veya personel olarak sisteme katılın. Davet kodu ile giriş yapın.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ Davet kodu ile katılma</p>
                <p>✓ Temel kullanıcı yetkileri</p>
                <p>✓ Bina bilgilerine erişim</p>
              </div>
              <Button
                onClick={() => handleLogin('resident')}
                disabled={isLoggingIn}
                className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Giriş Yap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        {!isAuthenticated && (
          <Card className="bg-muted/30 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Tüm kullanıcı tipleri <strong>Internet Identity</strong> ile güvenli giriş yapar.
                </p>
                <p className="text-xs text-muted-foreground">
                  Seçtiğiniz kullanıcı tipi, giriş yaptıktan sonra size uygun ekranı gösterecektir.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
