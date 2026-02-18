import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, UserCheck } from 'lucide-react';
import { useGetCallerUserProfile, useGetUserBuilding } from '@/hooks/useQueries';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Role } from '@/backend';

export default function BuildingMembers() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();

  const isLoading = profileLoading || buildingLoading;
  const hasBuilding = userProfile?.binaId !== null && userProfile?.binaId !== undefined;
  const isBinaSahibi = userProfile?.role === Role.binaSahibi;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
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

  // Mock data for demonstration - in real app this would come from backend
  const mockMembers = [
    {
      principal: userProfile?.binaId?.toString() || 'mock-principal-1',
      name: userProfile?.name || 'Siz',
      role: userProfile?.role || Role.binaSahibi,
      joinDate: userProfile?.firstLogin || BigInt(Date.now() * 1000000),
      isCurrentUser: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bina Üyeleri</h1>
        <p className="text-muted-foreground mt-2">
          {building?.binaAdi} binasına kayıtlı kullanıcılar
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMembers.length}</div>
            <p className="text-xs text-muted-foreground">Aktif kullanıcı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bina Sahibi</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter(m => m.role === Role.binaSahibi).length}
            </div>
            <p className="text-xs text-muted-foreground">Yönetici</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yetkili & Sakin</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMembers.filter(m => m.role !== Role.binaSahibi).length}
            </div>
            <p className="text-xs text-muted-foreground">Diğer üyeler</p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Üye Listesi</CardTitle>
          <CardDescription>
            Binaya kayıtlı tüm kullanıcılar ve rolleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Katılma Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {member.name}
                      {member.isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Siz
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(member.role)}>
                        {getRoleDisplayName(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(Number(member.joinDate) / 1000000).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                        Aktif
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Info Message */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Not:</strong> Yeni üyeler eklemek için Ana Sayfa'daki "Davet Kodu Yönetimi" bölümünden 
              davet kodu oluşturabilirsiniz. {isBinaSahibi ? 'Bina sahibi olarak tüm yetkilere sahipsiniz.' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
