import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, Navigate } from '@tanstack/react-router';
import { InternetIdentityProvider, useInternetIdentity } from './hooks/useInternetIdentity';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Users from './pages/Users';
import BuildingMembers from './pages/BuildingMembers';
import Announcements from './pages/Announcements';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      setShowProfileSetup(userProfile === null);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (showProfileSetup) {
    return <Navigate to="/profile" />;
  }

  return <>{children}</>;
}

function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <>
      {isAuthenticated ? (
        <Layout />
      ) : (
        <Outlet />
      )}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => (
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  ),
});

const buildingMembersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/building-members',
  component: () => (
    <ProtectedRoute>
      <BuildingMembers />
    </ProtectedRoute>
  ),
});

const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcements',
  component: () => (
    <ProtectedRoute>
      <Announcements />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  homeRoute,
  profileRoute,
  usersRoute,
  buildingMembersRoute,
  announcementsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <RouterProvider router={router} />
          <Toaster />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
