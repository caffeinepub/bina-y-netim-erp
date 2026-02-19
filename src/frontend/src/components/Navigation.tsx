import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, LayoutDashboard, Users, UserCircle, Menu, LogOut, Bell, UsersRound, Shield } from 'lucide-react';
import { useState } from 'react';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { Role } from '@/backend';

export default function Navigation() {
  const location = useLocation();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const userRole = userProfile?.role;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setMobileMenuOpen(false);
  };

  // Define all possible menu items
  const allMenuItems = [
    { 
      path: '/owner-dashboard', 
      label: 'Panel', 
      icon: LayoutDashboard,
      roles: [Role.binaSahibi]
    },
    { 
      path: '/manager-dashboard', 
      label: 'Panel', 
      icon: LayoutDashboard,
      roles: [Role.yetkili]
    },
    { 
      path: '/resident-dashboard', 
      label: 'Panel', 
      icon: LayoutDashboard,
      roles: [Role.sakin]
    },
    { 
      path: '/', 
      label: 'Ana Sayfa', 
      icon: Home,
      roles: [Role.binaSahibi, Role.yetkili, Role.sakin]
    },
    { 
      path: '/announcements', 
      label: 'Duyurular', 
      icon: Bell,
      roles: [Role.binaSahibi, Role.yetkili, Role.sakin]
    },
    { 
      path: '/building-members', 
      label: 'Üyeler', 
      icon: UsersRound,
      roles: [Role.binaSahibi, Role.yetkili]
    },
    { 
      path: '/users', 
      label: 'Kullanıcılar', 
      icon: Users,
      roles: [Role.binaSahibi]
    },
    { 
      path: '/profile', 
      label: 'Profil', 
      icon: UserCircle,
      roles: [Role.binaSahibi, Role.yetkili, Role.sakin]
    },
  ];

  // Filter menu items based on user role
  const menuItems = profileLoading || !userRole 
    ? [] 
    : allMenuItems.filter(item => item.roles.includes(userRole));

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (profileLoading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Bina Yönetim</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Bina Yönetim</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            {isAuthenticated && (
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {isAuthenticated && (
                  <>
                    <div className="border-t pt-4">
                      <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                        <LogOut className="w-5 h-5 mr-3" />
                        Çıkış Yap
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
