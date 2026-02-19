import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Bell, AlertCircle, Shield, Home } from 'lucide-react';
import { useGetUserBuilding, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Link } from '@tanstack/react-router';

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
    <div className="container mx-auto px-4 py-8 space-y-8">
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
          <CardDescription>
            Bina bilgileriniz ve duyurularınız
          </CardDescription>
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

      {/* Main Features */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Duyurular
            </CardTitle>
            <CardDescription>
              Bina yönetiminden gelen duyuruları görüntüleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bina yönetimi tarafından paylaşılan önemli duyurular ve bildirimler burada görünecektir.
            </p>
            <Link to="/announcements">
              <Button className="w-full">
                Duyuruları Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Arıza Bildirimi
            </CardTitle>
            <CardDescription>
              Bina ile ilgili arıza ve sorunları bildirin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ortak alanlarda veya binada tespit ettiğiniz arızaları yönetime bildirebilirsiniz.
            </p>
            <Button className="w-full" variant="outline" disabled>
              Yakında Gelecek
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duyurular</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Yeni duyuru yok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arıza Bildirimlerim</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Bekleyen bildirim yok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hesap Durumu</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Aktif</div>
            <p className="text-xs text-muted-foreground">
              Hesabınız aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Access Restrictions Notice */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <AlertCircle className="h-5 w-5" />
            Erişim Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Sakin kullanıcı olarak erişiminiz:</p>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Duyuruları görüntüleyebilirsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Arıza bildirimi yapabilirsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Profil bilgilerinizi güncelleyebilirsiniz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Yönetim paneline erişiminiz bulunmamaktadır</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Davet kodu oluşturamazsınız</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
