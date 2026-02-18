import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';
import { useRegisterWithInviteCode } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Role } from '@/backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InviteCodeRegistrationProps {
  suggestedRole?: Role;
  onSuccess?: () => void;
}

export default function InviteCodeRegistration({ suggestedRole, onSuccess }: InviteCodeRegistrationProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const registerMutation = useRegisterWithInviteCode();

  const validateCode = (value: string): boolean => {
    setValidationError(null);
    
    if (value.length === 0) {
      return true;
    }

    if (value.length !== 16) {
      setValidationError('Davet kodu 16 haneli olmalıdır');
      return false;
    }

    if (!/^[A-Za-z0-9]+$/.test(value)) {
      setValidationError('Sadece harf ve rakam kullanılabilir');
      return false;
    }

    return true;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInviteCode(value);
    validateCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCode(inviteCode) || inviteCode.length !== 16) {
      return;
    }

    try {
      await registerMutation.mutateAsync(inviteCode);
      toast.success('Davet kodu başarıyla kullanıldı!');
      setInviteCode('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Davet kodu kullanılırken bir hata oluştu';
      toast.error(errorMessage);
    }
  };

  const getRoleMessage = () => {
    if (suggestedRole === Role.yetkili) {
      return 'Yetkili olarak binaya katılmak için davet kodunuzu girin.';
    }
    if (suggestedRole === Role.sakin) {
      return 'Sakin veya personel olarak binaya katılmak için davet kodunuzu girin.';
    }
    return 'Mevcut bir binaya katılmak için davet kodunuzu girin.';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {suggestedRole && (
        <Alert>
          <KeyRound className="h-4 w-4" />
          <AlertDescription>
            {getRoleMessage()}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="inviteCode">Davet Kodu (16 haneli)</Label>
        <Input
          id="inviteCode"
          type="text"
          placeholder="XXXXXXXXXXXXXXXX"
          value={inviteCode}
          onChange={handleCodeChange}
          maxLength={16}
          className="font-mono text-center text-lg tracking-wider"
          disabled={registerMutation.isPending}
        />
        {validationError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Davet kodunuz 16 haneli olmalıdır (harf ve rakam)
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={registerMutation.isPending || inviteCode.length !== 16 || !!validationError}
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Davet Kodunu Kullan
          </>
        )}
      </Button>
    </form>
  );
}
