import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check, Plus, Users, Shield, Home, Calendar, User } from 'lucide-react';
import { useCreateInviteCode, useGetInviteCodes, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Role } from '@/backend';
import { toast } from 'sonner';
import { getRoleDisplayName } from '@/utils/roleTranslations';

export default function InviteCodePanel() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data: userProfile } = useGetCallerUserProfile();
  const { data: inviteCodes, isLoading: codesLoading } = useGetInviteCodes();
  const createInviteCode = useCreateInviteCode();

  const userRole = userProfile?.role;
  const isBinaSahibi = userRole === Role.binaSahibi;
  const isYetkili = userRole === Role.yetkili;

  // Determine available roles based on user's role
  const availableRoles: Role[] = [];
  if (isBinaSahibi) {
    availableRoles.push(Role.binaSahibi, Role.yetkili, Role.sakin);
  } else if (isYetkili) {
    availableRoles.push(Role.sakin);
  }

  const handleCreateCode = async () => {
    if (!selectedRole) {
      toast.error('Lütfen bir rol seçin');
      return;
    }

    try {
      await createInviteCode.mutateAsync(selectedRole);
      toast.success('Davet kodu başarıyla oluşturuldu!');
      setSelectedRole(null);
    } catch (error: any) {
      console.error('Davet kodu oluşturma hatası:', error);
      
      // Enhanced error handling
      if (error.message?.includes('Yetkililer başka yetkili davet edemez')) {
        toast.error('Yetkili kullanıcılar başka yetkili davet edemez');
      } else if (error.message?.includes('Yetkili kullanıcı bina sahibi davet edemez')) {
        toast.error('Yetkili kullanıcı bina sahibi davet edemez');
      } else if (error.message?.includes('Sakin kullanıcı davet kodu oluşturamaz')) {
        toast.error('Sakin kullanıcılar davet kodu oluşturamaz');
      } else {
        toast.error('Davet kodu oluşturulurken bir hata oluştu');
      }
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

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.binaSahibi:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case Role.yetkili:
        return <Users className="h-4 w-4 text-purple-600" />;
      case Role.sakin:
        return <Home className="h-4 w-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.binaSahibi:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case Role.yetkili:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      case Role.sakin:
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    }
  };

  if (availableRoles.length === 0) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Davet kodu oluşturma yetkiniz bulunmamaktadır.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Davet Kodu Yönetimi
        </CardTitle>
        <CardDescription>
          Yeni kullanıcıları binaya davet etmek için kod oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Code Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Yeni Davet Kodu Oluştur</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {availableRoles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  className="h-auto py-4 justify-start"
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center gap-3 w-full">
                    {getRoleIcon(role)}
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{getRoleDisplayName(role)}</p>
                      <p className="text-xs text-muted-foreground">
                        {role === Role.binaSahibi && 'Tam yetki'}
                        {role === Role.yetkili && 'Yönetim yetkisi'}
                        {role === Role.sakin && 'Standart kullanıcı'}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateCode}
            disabled={!selectedRole || createInviteCode.isPending}
            className="w-full"
            size="lg"
          >
            {createInviteCode.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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

        {/* Existing Codes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Mevcut Davet Kodları</h3>
            {inviteCodes && inviteCodes.length > 0 && (
              <Badge variant="secondary">
                {inviteCodes.length} Kod
              </Badge>
            )}
          </div>

          {codesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : inviteCodes && inviteCodes.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inviteCodes.map((code) => (
                <Card key={code.kod} className={code.kullanildiMi ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {code.kod}
                          </code>
                          <Badge variant="outline" className={getRoleColor(code.rol)}>
                            {getRoleIcon(code.rol)}
                            <span className="ml-1">{getRoleDisplayName(code.rol)}</span>
                          </Badge>
                          {code.kullanildiMi && (
                            <Badge variant="secondary" className="text-xs">
                              Kullanıldı
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(Number(code.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          {code.kullanildiMi && code.kullanimTarihi && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>
                                Kullanım: {new Date(Number(code.kullanimTarihi) / 1000000).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!code.kullanildiMi && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(code.kod)}
                          className="shrink-0"
                        >
                          {copiedCode === code.kod ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Henüz davet kodu oluşturulmadı</p>
              <p className="text-xs mt-1">Yukarıdan yeni bir kod oluşturabilirsiniz</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
