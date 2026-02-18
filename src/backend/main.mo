import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Role = {
    #binaSahibi;
    #yetkili;
    #sakin;
  };

  public type UserProfile = {
    name : Text;
    firstLogin : Time.Time;
    lastLogin : Time.Time;
    loginCount : Nat;
    binaId : ?Nat;
    role : Role;
  };

  public type Bina = {
    binaId : Nat;
    binaAdi : Text;
    olusturulmaTarihi : Time.Time;
    olusturanPrincipal : Principal;
  };

  public type DavetKodu = {
    kod : Text;
    binaId : Nat;
    rol : Role;
    olusturanPrincipal : Principal;
    olusturmaTarihi : Time.Time;
    kullanildiMi : Bool;
    kullanimTarihi : ?Time.Time;
    kullananPrincipal : ?Principal;
  };

  let binalar = Map.empty<Nat, Bina>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var binaCount = 0;
  let davetKodlari = Map.empty<Text, DavetKodu>();

  public shared ({ caller }) func binaOlustur(binaAdi : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar bina oluşturabilir");
    };

    // SECURITY FIX: Check if user already has a building assignment
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        switch (existingProfile.binaId) {
          case (?_) {
            Runtime.trap("Zaten bir binaya kayıtlısınız. Birden fazla bina oluşturamazsınız.");
          };
          case (null) { /* Can proceed */ };
        };
      };
      case (null) { /* New user, can proceed */ };
    };

    let binaId = binaCount;
    binaCount += 1;

    let bina : Bina = {
      binaId;
      binaAdi;
      olusturulmaTarihi = Time.now();
      olusturanPrincipal = caller;
    };

    binalar.add(binaId, bina);

    switch (userProfiles.get(caller)) {
      case (null) {
        let yeniProfil : UserProfile = {
          name = "";
          firstLogin = Time.now();
          lastLogin = Time.now();
          loginCount = 1;
          binaId = ?binaId;
          role = #binaSahibi;
        };
        userProfiles.add(caller, yeniProfil);
      };
      case (?mevcutProfil) {
        let guncellenmisProfil : UserProfile = {
          mevcutProfil with binaId = ?binaId;
          role = #binaSahibi;
        };
        userProfiles.add(caller, guncellenmisProfil);
      };
    };

    binaId;
  };

  public query ({ caller }) func kullaniciBinasiniGetir() : async ?Bina {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar bina bilgilerini görüntüleyebilir");
    };

    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profil) {
        switch (profil.binaId) {
          case (null) { null };
          case (?binaId) { binalar.get(binaId) };
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar profil görüntüleyebilir");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar profil kaydedebilir");
    };

    let existingProfile = userProfiles.get(caller);

    // SECURITY: Always preserve binaId and role from existing profile
    // If no existing profile, user must use binaOlustur or davetKoduIleKayitOl
    let (preservedBinaId, preservedRole) = switch (existingProfile) {
      case (null) {
        // New users cannot set binaId or role through saveCallerUserProfile
        // They must use binaOlustur or davetKoduIleKayitOl
        (null, #sakin);
      };
      case (?existing) {
        // Existing users cannot modify their binaId or role through this function
        (existing.binaId, existing.role);
      };
    };

    let secureProfile : UserProfile = {
      name = profile.name;
      firstLogin = profile.firstLogin;
      lastLogin = profile.lastLogin;
      loginCount = profile.loginCount;
      binaId = preservedBinaId;
      role = preservedRole;
    };

    userProfiles.add(caller, secureProfile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // SECURITY FIX: Strengthen authorization - only admins or the user themselves can view profiles
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Yetkisiz: Sadece kendi profilinizi görüntüleyebilirsiniz");
    };
    userProfiles.get(user);
  };

  // Invite Code Implementation
  func generateUniqueCode() : Text {
    let timestamp = Time.now();
    let randomPart = timestamp.toText();
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charsLength = chars.size();

    let randomString = Text.fromIter(
      randomPart.chars().take(8)
    );

    let timestampIter = timestamp.toText().chars();
    let timestampString = Text.fromIter(
      timestampIter.take(8)
    );

    let code = randomString # timestampString;
    let finalCode = Text.fromIter(
      code.chars().take(16)
    );

    if (davetKodlari.containsKey(finalCode)) {
      generateUniqueCode();
    } else {
      finalCode;
    };
  };

  public shared ({ caller }) func davetKoduOlustur(yeniRol : Role) : async Text {
    // Authorization: Only authenticated users can create invite codes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar davet kodu oluşturabilir");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profil bulunamadı: Lütfen önce bir bina oluşturun veya davet kodu ile kaydolun");
      };
      case (?profile) { profile };
    };

    let callerRol = callerProfile.role;

    // SECURITY: Hierarchical permission enforcement
    switch (callerRol, yeniRol) {
      case (#binaSahibi, #binaSahibi) {
        // BINA_SAHIBI can create BINA_SAHIBI codes
      };
      case (#binaSahibi, #yetkili) {
        // BINA_SAHIBI can create YETKILI codes
      };
      case (#binaSahibi, #sakin) {
        // BINA_SAHIBI can create SAKIN codes
      };
      case (#yetkili, #sakin) {
        // YETKILI can create SAKIN codes
      };
      case (#yetkili, #yetkili) {
        // YETKILI cannot create YETKILI codes
        Runtime.trap("Yetkililer başka yetkili davet edemez");
      };
      case (#yetkili, #binaSahibi) {
        // YETKILI cannot create BINA_SAHIBI codes
        Runtime.trap("Yetkili kullanıcı bina sahibi davet edemez");
      };
      case (#sakin, _) {
        // SAKIN cannot create any codes
        Runtime.trap("Sakin kullanıcı davet kodu oluşturamaz");
      };
    };

    let binaId = switch (callerProfile.binaId) {
      case (null) {
        Runtime.trap("Kullanıcının binaID'si yok: Lütfen önce bir bina oluşturun");
      };
      case (?id) { id };
    };

    let kod = generateUniqueCode();
    let yeniDavetKodu : DavetKodu = {
      kod;
      binaId;
      rol = yeniRol;
      olusturanPrincipal = caller;
      olusturmaTarihi = Time.now();
      kullanildiMi = false;
      kullanimTarihi = null;
      kullananPrincipal = null;
    };

    davetKodlari.add(kod, yeniDavetKodu);
    kod;
  };

  public shared ({ caller }) func davetKoduIleKayitOl(kod : Text) : async Text {
    // Authorization: Only authenticated users can use invite codes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar davet kodu kullanabilir");
    };

    let davetKodu = switch (davetKodlari.get(kod)) {
      case (null) {
        Runtime.trap("Geçersiz davet kodu: Lütfen geçerli bir kod girin");
      };
      case (?code) { code };
    };

    if (davetKodu.kullanildiMi) {
      Runtime.trap("Davet kodu zaten kullanılmış");
    };

    // SECURITY: Check if user already has a building assignment
    let existingProfile = userProfiles.get(caller);
    switch (existingProfile) {
      case (?profile) {
        switch (profile.binaId) {
          case (?existingBinaId) {
            if (existingBinaId != davetKodu.binaId) {
              Runtime.trap("Zaten başka bir binaya kayıtlısınız");
            };
            // SECURITY FIX: If already in same building, prevent role escalation
            // User cannot use invite code to upgrade their role
            switch (profile.role, davetKodu.rol) {
              case (#binaSahibi, _) {
                Runtime.trap("Bina sahibi olarak zaten en yüksek yetkiye sahipsiniz");
              };
              case (#yetkili, #binaSahibi) {
                Runtime.trap("Yetkili kullanıcı bina sahibi olamaz");
              };
              case (#yetkili, #yetkili) {
                Runtime.trap("Zaten yetkili kullanıcısınız");
              };
              case (#sakin, #binaSahibi) {
                Runtime.trap("Sakin kullanıcı bina sahibi olamaz");
              };
              case (#sakin, #yetkili) {
                // Allow sakin to become yetkili
              };
              case (#sakin, #sakin) {
                Runtime.trap("Zaten sakin kullanıcısınız");
              };
              case (#yetkili, #sakin) {
                Runtime.trap("Yetkili kullanıcı sakin olamaz");
              };
            };
          };
          case (null) { /* No existing building, can proceed */ };
        };
      };
      case (null) { /* No existing profile, can proceed */ };
    };

    let userProfile = switch (existingProfile) {
      case (null) {
        {
          name = "";
          firstLogin = Time.now();
          lastLogin = Time.now();
          loginCount = 1;
          binaId = ?davetKodu.binaId;
          role = davetKodu.rol;
        };
      };
      case (?profile) {
        {
          profile with
          binaId = ?davetKodu.binaId;
          role = davetKodu.rol;
        };
      };
    };

    let guncellenmisDavetKodu : DavetKodu = {
      davetKodu with
      kullanildiMi = true;
      kullanimTarihi = ?Time.now();
      kullananPrincipal = ?caller;
    };

    userProfiles.add(caller, userProfile);
    davetKodlari.add(kod, guncellenmisDavetKodu);

    "Davet kodu başarıyla kullanıldı";
  };

  public query ({ caller }) func davetKodlariniListele() : async [DavetKodu] {
    // Authorization: Only authenticated users can list their invite codes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Yetkisiz: Sadece kullanıcılar davet kodlarını listeleyebilir");
    };

    // SECURITY: Filter to only show codes created by the caller
    let filteredEntries = davetKodlari.entries().toArray().filter(
      func((_, davetKodu)) {
        davetKodu.olusturanPrincipal == caller;
      }
    );
    let mappedEntries = filteredEntries.map(func((_, davetKodu)) { davetKodu });
    mappedEntries;
  };
};
