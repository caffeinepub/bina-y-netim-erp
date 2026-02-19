import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, Calendar, User } from 'lucide-react';
import { useListAnnouncements } from '@/hooks/useQueries';

export default function AnnouncementsList() {
  const { data: announcements, isLoading, error } = useListAnnouncements();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Duyurular
          </CardTitle>
          <CardDescription>Yayınlanan tüm duyurular</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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
            <Megaphone className="h-5 w-5" />
            Duyurular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p className="text-sm">Duyurular yüklenirken bir hata oluştu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Duyurular
        </CardTitle>
        <CardDescription>Yayınlanan tüm duyurular</CardDescription>
      </CardHeader>
      <CardContent>
        {announcements && announcements.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {announcements.map((announcement) => (
              <Card key={announcement.duyuruId}>
                <CardHeader>
                  <CardTitle className="text-lg">{announcement.baslik}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(Number(announcement.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {announcement.olusturanPrincipal.toString().slice(0, 15)}...
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {announcement.aciklama}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
            <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Henüz duyuru yok</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
