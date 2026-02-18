import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Building2, UserCheck, Info, Shield, Home } from 'lucide-react';
import { useGetCallerUserProfile, useGetUserBuilding, useGetInviteCodes } from '@/hooks/useQueries';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Role } from '@/backend';

export default function BuildingMembers() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();
  const { data: inviteCodes, isLoading: codesLoading } = useGetInviteCodes();

  const isLoading = profileLoading || buildingLoading;
  const hasBuilding = userProfile?.binaId !== null && userProfile?.binaId !== undefined;
  const isBinaSahibi = userProfile?.role === Role.binaSahibi;
  const isYetkili = userProfile?.role === Role.yetkili;

  // Calculate statistics from invite codes
  const usedCodes = inviteCodes?.filter(code => code.kullanildiMi) || [];
  const totalMembers = 1 + usedCodes.length; // 1 for building owner + used invite codes
  const binaSahibiCount = usedCodes.filter(code => code.rol === Role.binaSahibi).length + 1;
  const yetkiliCount = usedCodes.filter(code => code.rol === Role.yetkili).length;
  const sakinCount = usedCodes.filter(code => code.rol === Role.sakin).length;

  // Build members list from available data
  const members = [
    {
      name: userProfile?.name || 'Siz',
      role: userProfile?.role || Role.binaSahibi,
      joinDate: userProfile?.firstLogin || BigInt(Date.now() * 1000000),
      isCurrentUser: true,
      source: 'Bina Sahibi',
    },
    ...usedCodes.map(code => ({
      name: code.kullananPrincipal?.toString().slice(0, 8) + '...' || 'Bilinmeyen',
      role: code.rol,
      joinDate: code.kullanimTarihi || code.olusturmaTarihi,
      isCurrentUser: false,
      source: 'Davet Kodu',
    })),
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!hasBuilding) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bina Üyeleri</h1>
          <p className="text-muted-foreground mt-2">
            Binaya kayıtlı kullanıcıları görüntüleyin
          </p>
        </div>
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Bina Bulunamadı</CardTitle>
            <CardDescription>
              Bu sayfayı görüntülemek için bir binaya kayıtlı olmanız gerekiyor
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bina Üyeleri</h1>
        <p className="text-muted-foreground mt-2">
          {building?.binaAdi} binasına kayıtlı kullanıcılar
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Bu sayfa, davet kodları üzerinden katılan üyeleri gösterir. Detaylı üye listesi için backend geliştirmesi devam etmektedir.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Aktif kullanıcı</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bina Sahibi</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{binaSahibiCount}</div>
            <p className="text-xs text-muted-foreground">Yönetici</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yetkili & Sakin</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{yetkiliCount + sakinCount}</div>
            <p className="text-xs text-muted-foreground">
              {yetkiliCount} Yetkili, {sakinCount} Sakin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Rol Dağılımı
          </CardTitle>
          <CardDescription>
            Binada bulunan kullanıcıların rol bazlı dağılımı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-500/5 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Bina Sahibi</p>
                  <p className="text-sm text-muted-foreground">Tam yetki sahibi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{binaSahibiCount}</p>
                <p className="text-xs text-muted-foreground">
                  {((binaSahibiCount / totalMembers) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-500/5 border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Yetkili</p>
                  <p className="text-sm text-muted-foreground">Yönetim yetkisi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{yetkiliCount}</p>
                <p className="text-xs text-muted-foreground">
                  {((yetkiliCount / totalMembers) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/5 border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Sakin</p>
                  <p className="text-sm text-muted-foreground">Standart kullanıcı</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{sakinCount}</p>
                <p className="text-xs text-muted-foreground">
                  {((sakinCount / totalMembers) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Üye Listesi</CardTitle>
          <CardDescription>
            Binaya kayıtlı kullanıcılar ve rolleri (davet kodu bazlı)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Katılma Tarihi</TableHead>
                  <TableHead>Kaynak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={index} className={member.isCurrentUser ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.isCurrentUser && (
                            <p className="text-xs text-muted-foreground">Siz</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(member.role)}>
                        {getRoleDisplayName(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(Number(member.joinDate) / 1000000).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {member.source}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {members.length === 1 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Henüz başka üye yok. Davet kodu oluşturarak yeni üyeler ekleyebilirsiniz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
