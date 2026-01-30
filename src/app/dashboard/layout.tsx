import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { SEO_CONFIG } from '@/constants/seo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { User, LogOut, Crosshair, Shield, Car, LayoutDashboard, Award, Settings, CreditCard, ShieldCheck, Package as PackageIcon, IdCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import logoImage from '@/assets/images/logo.png';

const mainItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
];

const serviceItems = [
  {
    title: 'Firearms',
    url: '/dashboard/firearms',
    icon: Crosshair,
  },
  {
    title: 'Vehicles',
    url: '/dashboard/vehicles',
    icon: Car,
  },
  {
    title: 'Drivers',
    url: '/dashboard/drivers',
    icon: IdCard,
  },
  {
    title: 'Certificates',
    url: '/dashboard/certificates',
    icon: Award,
  },
  {
    title: 'PSIRA Records',
    url: '/dashboard/psira',
    icon: Shield,
  },
];

const settingsItems = [
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Subscription',
    url: '/dashboard/subscription',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

const adminItems = [
  { title: 'Permissions', url: '/dashboard/admin/permissions', icon: ShieldCheck },
  { title: 'Packages', url: '/dashboard/admin/packages', icon: PackageIcon },
  { title: 'Subscriptions', url: '/dashboard/admin/subscriptions', icon: CreditCard },
];

export default function DashboardLayout(): React.JSX.Element {
  const { authUser, logout } = useAuthContext();
  const location = useLocation();
  const [pageHeaderContent, setPageHeaderContent] = useState<React.ReactNode | null>(null);

  const handleLogout = (): void => {
    void logout();
  };

  const allNavItems = [
    ...mainItems,
    ...serviceItems,
    ...(authUser?.role === 'Admin' ? adminItems : []),
    ...settingsItems,
  ];

  const currentNavItem = allNavItems.find((item) => item.url === location.pathname);
  const pageTitle = currentNavItem?.title ?? 'Dashboard';

  useEffect(() => {
    document.title = `${pageTitle} | ${SEO_CONFIG.siteName}`;
  }, [pageTitle]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-2 px-2 py-2">
            <img src={logoImage} alt="Remlic" className="h-8 w-8" />
            <span className="font-semibold">Remlic</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Services</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {serviceItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {authUser?.role === 'Admin' && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <div className="text-sm text-muted-foreground truncate">
              {authUser?.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {pageHeaderContent}
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet context={{ setPageHeaderContent }} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
