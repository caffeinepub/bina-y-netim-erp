import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DavetKodu {
    kod: string;
    rol: Role;
    olusturmaTarihi: Time;
    kullanildiMi: boolean;
    kullananPrincipal?: Principal;
    olusturanPrincipal: Principal;
    kullanimTarihi?: Time;
    binaId: bigint;
}
export interface Bina {
    olusturulmaTarihi: Time;
    binaAdi: string;
    olusturanPrincipal: Principal;
    binaId: bigint;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    role: Role;
    loginCount: bigint;
    firstLogin: Time;
    lastLogin: Time;
    binaId?: bigint;
}
export enum Role {
    yetkili = "yetkili",
    sakin = "sakin",
    binaSahibi = "binaSahibi"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    binaOlustur(binaAdi: string): Promise<bigint>;
    davetKodlariniListele(): Promise<Array<DavetKodu>>;
    davetKoduIleKayitOl(kod: string): Promise<string>;
    davetKoduOlustur(rol: Role): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    kullaniciBinasiniGetir(): Promise<Bina | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
