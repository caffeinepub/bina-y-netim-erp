import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Plus, Check, Loader2 } from 'lucide-react';
import { useCreateInviteCode, useGetInviteCodes } from '@/hooks/useQueries';
import { Role } from '@/backend';
import { getRoleDisplayName } from '@/utils/roleTranslations';
import { toast } from 'sonner';

export default function InviteCodePanel() {
  const [selectedRole, setSelectedRole] = useState<Role>(Role.sakin);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);

  const createMutation = useCreateInviteCode();
  const { data: inviteCodes, isLoading: codesLoading } = useGetInviteCodes();

  const handleCreateCode = async () => {
    try {
      const code = await createMutation.mutateAsync(selectedRole);
      setLastCreatedCode(code);
      toast.success('Davet kodu başarıyla oluşturuldu!');
    } catch (error: any) {
      toast.error(error.message || 'Davet kodu oluşturulurken bir hata oluştu');
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Davet kodu kopyalandı!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Kopyalama başarısız oldu');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Davet Kodu Yönetimi</CardTitle>
        <CardDescription>
          Binaya yeni kullanıcılar eklemek için davet kodu oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Invite Code Form */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.yetkili}>Yetkili</SelectItem>
                  <SelectItem value={Role.sakin}>Sakin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCreateCode}
              disabled={createMutation.isPending}
              className="sm:w-auto"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Davet Kodu Oluştur
                </>
              )}
            </Button>
          </div>

          {/* Display Last Created Code */}
          {lastCreatedCode && (
            <Alert className="bg-primary/5 border-primary/20">
              <AlertDescription className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Yeni Davet Kodu:</p>
                  <code className="text-lg font-mono font-bold text-primary">
                    {lastCreatedCode}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(lastCreatedCode)}
                >
                  {copiedCode === lastCreatedCode ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Invite Codes Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Oluşturulan Davet Kodları</h3>
          {codesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !inviteCodes || inviteCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Henüz davet kodu oluşturulmadı
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Davet Kodu</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Oluşturma Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inviteCodes.map((code) => (
                    <TableRow key={code.kod}>
                      <TableCell>
                        <code className="text-sm font-mono">{code.kod}</code>
                      </TableCell>
                      <TableCell>{getRoleDisplayName(code.rol)}</TableCell>
                      <TableCell>
                        {new Date(Number(code.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {code.kullanildiMi ? (
                          <span className="text-sm text-muted-foreground">Kullanıldı</span>
                        ) : (
                          <span className="text-sm text-green-600 font-medium">Kullanılmadı</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(code.kod)}
                          disabled={code.kullanildiMi}
                        >
                          {copiedCode === code.kod ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
