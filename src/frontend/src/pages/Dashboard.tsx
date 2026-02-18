import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCheck, Calendar, Fingerprint } from 'lucide-react';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const principal = identity?.getPrincipal().toString() || '';

  const isFirstLogin = userProfile ? userProfile.loginCount === BigInt(1) : false;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
        <p className="text-muted-foreground mt-2">
          Bina Yönetim ERP sistemine başarıyla giriş yaptınız
        </p>
      </div>

      {isFirstLogin && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              İlk Girişiniz
            </CardTitle>
            <CardDescription>
              Sisteme ilk kez giriş yapıyorsunuz. Hesabınız başarıyla oluşturuldu.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcı Durumu</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Aktif</div>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
              Giriş Yapıldı
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giriş Durumu</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {isFirstLogin ? 'İlk Giriş' : 'Tekrar Giriş'}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal ID</CardTitle>
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono break-all bg-muted p-3 rounded-md">
              {principal}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
          <CardDescription>
            Hesap ve kimlik doğrulama detayları
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Kimlik Doğrulama</p>
              <p className="text-sm">Internet Identity</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Hesap Tipi</p>
              <p className="text-sm">Kullanıcı</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Kayıt Durumu</p>
              <p className="text-sm">{userProfile ? 'Kayıtlı' : 'Yükleniyor...'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Oturum Durumu</p>
              <p className="text-sm">Aktif</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
