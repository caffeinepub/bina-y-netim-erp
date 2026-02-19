import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Calendar, User } from 'lucide-react';
import { useListApartments, useListBuildingUsers } from '@/hooks/useQueries';

export default function DaireGorunumu() {
  const { data: apartments, isLoading: apartmentsLoading } = useListApartments();
  const { data: buildingUsers, isLoading: usersLoading } = useListBuildingUsers();

  const isLoading = apartmentsLoading || usersLoading;

  // Check if an apartment is occupied by matching daireId with user assignments
  const isApartmentOccupied = (daireId: string): boolean => {
    if (!buildingUsers) return false;
    return buildingUsers.some(user => user.daireId === daireId);
  };

  // Get occupant name for an apartment
  const getOccupantName = (daireId: string): string | null => {
    if (!buildingUsers) return null;
    const occupant = buildingUsers.find(user => user.daireId === daireId);
    return occupant?.name || null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Daire Görünümü
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Daire Görünümü
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
            <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Henüz daire eklenmemiş</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Daire Görünümü
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apartments.map((apartment) => {
            const isOccupied = isApartmentOccupied(apartment.daireId);
            const occupantName = getOccupantName(apartment.daireId);

            return (
              <HoverCard key={apartment.daireId}>
                <HoverCardTrigger asChild>
                  <Card className="relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{apartment.daireAdi}</CardTitle>
                        </div>
                        <Badge variant={isOccupied ? 'default' : 'secondary'}>
                          {isOccupied ? 'Dolu' : 'Boş'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isOccupied && occupantName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="truncate">{occupantName}</span>
                        </div>
                      )}
                      {!isOccupied && (
                        <div className="text-sm text-muted-foreground italic">
                          Kullanıcı atanmamış
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Daire Bilgileri</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apartment.daireAdi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Oluşturulma: {new Date(Number(apartment.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Durum: <Badge variant={isOccupied ? 'default' : 'secondary'} className="ml-1">
                              {isOccupied ? 'Dolu' : 'Boş'}
                            </Badge>
                          </span>
                        </div>
                        {isOccupied && occupantName && (
                          <div className="pt-2 border-t">
                            <p className="text-sm font-medium">Sakin: {occupantName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
