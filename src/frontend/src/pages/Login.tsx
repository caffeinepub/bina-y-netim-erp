import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, identity, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bina Yönetim ERP</h1>
            <p className="text-muted-foreground mt-2">
              Bina yönetim sisteminize hoş geldiniz
            </p>
          </div>
        </div>

        {/* Internet Identity Login */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Internet Identity ile Giriş</CardTitle>
            <CardDescription>
              Güvenli kimlik doğrulama ile giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </Button>

            {isLoginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">
                  {loginError?.message || 'Giriş yapılırken bir hata oluştu'}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Internet Identity ile güvenli giriş yapın
            </p>
          </CardContent>
        </Card>

        {/* Info Section */}
        {!isAuthenticated && (
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Giriş yaptıktan sonra bina oluşturabilir veya davet kodu ile bir binaya katılabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
