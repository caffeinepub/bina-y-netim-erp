import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useListApartments, useReportIssue } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function IssueReportForm() {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [daireId, setDaireId] = useState('');

  const { data: apartments, isLoading: apartmentsLoading } = useListApartments();
  const reportIssue = useReportIssue();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!baslik.trim() || !aciklama.trim() || !daireId) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    reportIssue.mutate(
      { baslik, aciklama, daireId },
      {
        onSuccess: () => {
          toast.success('Arıza başarıyla bildirildi');
          setBaslik('');
          setAciklama('');
          setDaireId('');
        },
        onError: (error: any) => {
          const errorMessage = error?.message || 'Arıza bildirimi sırasında bir hata oluştu';
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Arıza Bildir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baslik">Başlık</Label>
            <Input
              id="baslik"
              placeholder="Arıza başlığını girin"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aciklama">Açıklama</Label>
            <Textarea
              id="aciklama"
              placeholder="Arıza detaylarını açıklayın"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daireId">Daire</Label>
            <Select value={daireId} onValueChange={setDaireId} required>
              <SelectTrigger id="daireId">
                <SelectValue placeholder="Daire seçin" />
              </SelectTrigger>
              <SelectContent>
                {apartmentsLoading ? (
                  <SelectItem value="loading" disabled>
                    Yükleniyor...
                  </SelectItem>
                ) : apartments && apartments.length > 0 ? (
                  apartments.map((apartment) => (
                    <SelectItem key={apartment.daireId} value={apartment.daireId}>
                      {apartment.daireAdi}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-apartments" disabled>
                    Daire bulunamadı
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={reportIssue.isPending}>
            {reportIssue.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bildiriliyor...
              </>
            ) : (
              'Arıza Bildir'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
