import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, Bina, Role, UserProfil, Daire, Duyuru, Ariza } from '../backend';

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserBuilding() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Bina | null>({
    queryKey: ['userBuilding'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.kullaniciBinasiniGetir();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateBuilding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (binaAdi: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.binaOlustur(binaAdi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBuilding'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rol: Role) => {
      if (!actor) throw new Error('Actor not available');
      return actor.davetKoduOlustur(rol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes'] });
    },
  });
}

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend does not have davetKodlariniListele function
      // Returning empty array as placeholder
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterWithInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kod: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend does not have davetKoduIleKayitOl function
      throw new Error('Davet kodu ile kayıt fonksiyonu henüz uygulanmadı');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userBuilding'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useListBuildingUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfil[]>({
    queryKey: ['buildingUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.kullanicilariListele();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateApartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (daireAdi: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.daireOlustur(daireAdi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });
}

export function useListApartments() {
  const { actor, isFetching } = useActor();

  return useQuery<Daire[]>({
    queryKey: ['apartments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.daireleriListele();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ baslik, aciklama }: { baslik: string; aciklama: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.duyuruOlustur(baslik, aciklama);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useListAnnouncements() {
  const { actor, isFetching } = useActor();

  return useQuery<Duyuru[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.duyurulariListele();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReportIssue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ baslik, aciklama, daireId }: { baslik: string; aciklama: string; daireId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.arizaBildir(baslik, aciklama, daireId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}

export function useListIssues() {
  const { actor, isFetching } = useActor();

  return useQuery<Ariza[]>({
    queryKey: ['issues'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend arizalariListele function not yet implemented
      // For now, return empty array
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
