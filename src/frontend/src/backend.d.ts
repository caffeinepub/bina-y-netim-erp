import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    role: Role;
    loginCount: bigint;
    firstLogin: Time;
    lastLogin: Time;
    daireId?: string;
    binaId?: bigint;
}
export interface Bina {
    olusturulmaTarihi: Time;
    binaAdi: string;
    olusturanPrincipal: Principal;
    binaId: bigint;
}
export type Time = bigint;
export interface Duyuru {
    olusturmaTarihi: Time;
    baslik: string;
    duyuruId: string;
    aciklama: string;
    olusturanPrincipal: Principal;
    binaId: bigint;
}
export interface UserProfil {
    principal: Principal;
    name: string;
    role: Role;
    loginCount: bigint;
    firstLogin: Time;
    lastLogin: Time;
    daireId?: string;
    binaId?: bigint;
}
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
export interface Daire {
    olusturmaTarihi: Time;
    daireId: string;
    binaId: bigint;
    daireAdi: string;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
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
    daireOlustur(daireAdi: string): Promise<string>;
    daireleriListele(): Promise<Array<Daire>>;
    davetKodlariniListele(): Promise<Array<DavetKodu>>;
    davetKoduIleKayitOl(kod: string): Promise<string>;
    davetKoduOlustur(yeniRol: Role): Promise<string>;
    duyuruOlustur(baslik: string, aciklama: string): Promise<Duyuru>;
    duyurulariListele(): Promise<Array<Duyuru>>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    kullaniciBinasiniGetir(): Promise<Bina | null>;
    kullanicilariListele(): Promise<Array<UserProfil>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
