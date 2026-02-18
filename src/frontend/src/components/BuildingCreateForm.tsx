import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateBuilding } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BuildingCreateFormProps {
  onSuccess?: () => void;
}

export default function BuildingCreateForm({ onSuccess }: BuildingCreateFormProps) {
  const [binaAdi, setBinaAdi] = useState('');
  const [error, setError] = useState('');
  const createBuilding = useCreateBuilding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!binaAdi.trim()) {
      setError('Bina adı boş olamaz');
      return;
    }

    try {
      await createBuilding.mutateAsync(binaAdi.trim());
      toast.success('Bina başarıyla oluşturuldu!');
      setBinaAdi('');
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.message || 'Bina oluşturulurken bir hata oluştu';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Bina Oluştur</CardTitle>
        <CardDescription>
          Bina yönetim sisteminiz için yeni bir bina oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="binaAdi">Bina Adı</Label>
            <Input
              id="binaAdi"
              type="text"
              placeholder="Örn: Gül Apartmanı"
              value={binaAdi}
              onChange={(e) => setBinaAdi(e.target.value)}
              disabled={createBuilding.isPending}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={createBuilding.isPending || !binaAdi.trim()}
            className="w-full"
          >
            {createBuilding.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              'Oluştur'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
