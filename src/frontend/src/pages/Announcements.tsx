import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Plus, Calendar, User, Megaphone } from 'lucide-react';
import { useGetCallerUserProfile, useGetUserBuilding } from '@/hooks/useQueries';
import { getRoleDisplayName, getRoleVariant } from '@/utils/roleTranslations';
import { Role } from '@/backend';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: Role;
  createdAt: bigint;
  priority: 'low' | 'medium' | 'high';
}

export default function Announcements() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: building, isLoading: buildingLoading } = useGetUserBuilding();

  const isLoading = profileLoading || buildingLoading;
  const hasBuilding = userProfile?.binaId !== null && userProfile?.binaId !== undefined;
  const canCreateAnnouncement = userProfile?.role === Role.binaSahibi || userProfile?.role === Role.yetkili;

  // Mock announcements for demonstration
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Hoş Geldiniz',
      content: 'Bina yönetim sistemimize hoş geldiniz. Bu alan duyurular için kullanılacaktır.',
      author: userProfile?.name || 'Sistem',
      authorRole: userProfile?.role || Role.binaSahibi,
      createdAt: BigInt(Date.now() * 1000000),
      priority: 'medium',
    },
  ]);

  const handleCreateAnnouncement = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      author: userProfile?.name || 'Anonim',
      authorRole: userProfile?.role || Role.sakin,
      createdAt: BigInt(Date.now() * 1000000),
      priority,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle('');
    setContent('');
    setPriority('medium');
    setShowCreateForm(false);
    toast.success('Duyuru başarıyla oluşturuldu!');
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const variants = {
      low: { label: 'Düşük', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
      medium: { label: 'Orta', className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' },
      high: { label: 'Yüksek', className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
    };
    const variant = variants[priority];
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-muted-foreground mt-2">
            Bina duyurularını görüntüleyin ve yönetin
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Duyurular</h1>
          <p className="text-muted-foreground mt-2">
            {building?.binaAdi} binası duyuruları
          </p>
        </div>
        {canCreateAnnouncement && !showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Duyuru</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Aktif duyuru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Yeni duyuru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öncelikli</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Yüksek öncelik</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && canCreateAnnouncement && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Yeni Duyuru Oluştur</CardTitle>
            <CardDescription>
              Binaya yeni bir duyuru ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Başlık</label>
              <Input
                placeholder="Duyuru başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">İçerik</label>
              <Textarea
                placeholder="Duyuru içeriği"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Öncelik</label>
              <div className="flex gap-2">
                <Button
                  variant={priority === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('low')}
                >
                  Düşük
                </Button>
                <Button
                  variant={priority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('medium')}
                >
                  Orta
                </Button>
                <Button
                  variant={priority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('high')}
                >
                  Yüksek
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAnnouncement}>
                Duyuru Oluştur
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permission Alert */}
      {!canCreateAnnouncement && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Duyuru oluşturmak için Bina Sahibi veya Yetkili rolüne sahip olmanız gerekiyor.
          </AlertDescription>
        </Alert>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Henüz duyuru bulunmuyor</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{announcement.author}</span>
                      <Badge variant={getRoleVariant(announcement.authorRole)} className="text-xs">
                        {getRoleDisplayName(announcement.authorRole)}
                      </Badge>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(Number(announcement.createdAt) / 1000000).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  {getPriorityBadge(announcement.priority)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
