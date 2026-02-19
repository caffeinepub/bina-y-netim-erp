import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Megaphone, Plus } from 'lucide-react';
import { useCreateAnnouncement } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function AnnouncementCreateForm() {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!baslik.trim()) {
      toast.error('Lütfen duyuru başlığı girin');
      return;
    }

    if (!aciklama.trim()) {
      toast.error('Lütfen duyuru açıklaması girin');
      return;
    }

    try {
      await createAnnouncement.mutateAsync({
        baslik: baslik.trim(),
        aciklama: aciklama.trim(),
      });
      toast.success('Duyuru başarıyla oluşturuldu');
      setBaslik('');
      setAciklama('');
    } catch (error: any) {
      console.error('Duyuru oluşturma hatası:', error);
      toast.error('Duyuru oluşturulurken bir hata oluştu');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Yeni Duyuru Oluştur
        </CardTitle>
        <CardDescription>Tüm kullanıcılara duyuru gönderin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baslik">Başlık</Label>
            <Input
              id="baslik"
              placeholder="Duyuru başlığı"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              disabled={createAnnouncement.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aciklama">Açıklama</Label>
            <Textarea
              id="aciklama"
              placeholder="Duyuru içeriği"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              disabled={createAnnouncement.isPending}
              rows={4}
            />
          </div>
          <Button
            type="submit"
            disabled={createAnnouncement.isPending || !baslik.trim() || !aciklama.trim()}
            className="w-full"
          >
            {createAnnouncement.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Duyuru Yayınla
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
