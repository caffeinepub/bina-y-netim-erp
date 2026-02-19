import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Calendar } from 'lucide-react';
import { useListApartments } from '@/hooks/useQueries';

export default function ApartmentsList() {
  const { data: apartments, isLoading, error } = useListApartments();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Daire Listesi
          </CardTitle>
          <CardDescription>Binadaki tüm daireler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Daire Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p className="text-sm">Daireler yüklenirken bir hata oluştu</p>
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
          Daire Listesi
        </CardTitle>
        <CardDescription>Binadaki tüm daireler</CardDescription>
      </CardHeader>
      <CardContent>
        {apartments && apartments.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Daire Adı</TableHead>
                  <TableHead>Oluşturulma Tarihi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.map((apartment) => (
                  <TableRow key={apartment.daireId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{apartment.daireAdi}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(apartment.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
            <Home className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Henüz daire eklenmedi</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
