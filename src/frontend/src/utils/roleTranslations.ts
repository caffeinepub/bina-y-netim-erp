import { Role } from '../backend';

export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case Role.binaSahibi:
      return 'Bina Sahibi';
    case Role.yetkili:
      return 'Yetkili';
    case Role.sakin:
      return 'Sakin';
    default:
      return 'Bilinmeyen';
  }
}

export function getRoleVariant(role: Role): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case Role.binaSahibi:
      return 'default';
    case Role.yetkili:
      return 'secondary';
    case Role.sakin:
      return 'outline';
    default:
      return 'outline';
  }
}
