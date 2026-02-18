import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Fingerprint, Shield, Calendar, UserCog } from 'lucide-react';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';

export default function Profile() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal().toString() || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground mt-2">
          Hesap bilgilerinizi ve kimlik doğrulama detaylarınızı görüntüleyin
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Kullanıcı Bilgileri
            </CardTitle>
            <CardDescription>
              Hesabınıza ait temel bilgiler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Principal ID</p>
              </div>
              <div className="text-xs font-mono break-all bg-muted p-3 rounded-md">
                {principal}
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Kimlik Doğrulama</p>
                </div>
                <p className="text-sm text-muted-foreground">Internet Identity</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Oturum Tarihi</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hesap Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Durum</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                  Aktif
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tip</span>
                <Badge variant="secondary">Kullanıcı</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rol</span>
                {profileLoading ? (
                  <Skeleton className="h-5 w-24" />
                ) : userProfile?.role ? (
                  <Badge variant={getRoleVariant(userProfile.role)}>
                    {getRoleDisplayName(userProfile.role)}
                  </Badge>
                ) : (
                  <Badge variant="outline">Henüz Atanmadı</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Rol Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : userProfile?.role ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleVariant(userProfile.role)} className="text-sm">
                      {getRoleDisplayName(userProfile.role)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.role === 'binaSahibi' && 'Bina oluşturma ve tam yönetim yetkilerine sahipsiniz.'}
                    {userProfile.role === 'yetkili' && 'Bina yönetiminde yetkili olarak görev yapıyorsunuz.'}
                    {userProfile.role === 'sakin' && 'Binada sakin olarak kayıtlısınız.'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Henüz bir rol atanmamış. Bir bina oluşturduğunuzda veya davet kodu ile katıldığınızda rol atanacaktır.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Güvenlik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hesabınız Internet Identity ile korunmaktadır. Kimlik doğrulama bilgileriniz güvenli bir şekilde saklanır.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gelecek Özellikler</CardTitle>
          <CardDescription>
            Profil sayfanıza eklenecek özellikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Rol Yönetimi</p>
              <p className="text-xs text-muted-foreground">
                Bina yetkilisi veya daire sakini rolü atanacak
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Bina Bilgileri</p>
              <p className="text-xs text-muted-foreground">
                Bağlı olduğunuz bina ve daire bilgileri
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">İletişim Bilgileri</p>
              <p className="text-xs text-muted-foreground">
                E-posta ve telefon numarası ekleme
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Bildirim Tercihleri</p>
              <p className="text-xs text-muted-foreground">
                Duyuru ve bildirim ayarları
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
