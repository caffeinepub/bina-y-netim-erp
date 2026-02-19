import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Plus } from 'lucide-react';
import { useCreateApartment } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function ApartmentCreateForm() {
  const [daireAdi, setDaireAdi] = useState('');
  const createApartment = useCreateApartment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!daireAdi.trim()) {
      toast.error('Lütfen daire adı girin');
      return;
    }

    try {
      await createApartment.mutateAsync(daireAdi.trim());
      toast.success('Daire başarıyla oluşturuldu');
      setDaireAdi('');
    } catch (error: any) {
      console.error('Daire oluşturma hatası:', error);
      toast.error('Daire oluşturulurken bir hata oluştu');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Yeni Daire Ekle
        </CardTitle>
        <CardDescription>Binaya yeni bir daire ekleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daireAdi">Daire Adı / Numarası</Label>
            <Input
              id="daireAdi"
              placeholder="Örn: 1, 2A, B3, vb."
              value={daireAdi}
              onChange={(e) => setDaireAdi(e.target.value)}
              disabled={createApartment.isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={createApartment.isPending || !daireAdi.trim()}
            className="w-full"
          >
            {createApartment.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Daire Oluştur
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
