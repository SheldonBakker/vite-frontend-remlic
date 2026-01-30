import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Target,
  Car,
  GraduationCap,
  BarChart3,
  Clock,
  MessageCircle,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Bell,
} from 'lucide-react';
import { useAuthContext } from '@/context/authContext';
import { SupportDialog } from '@/components/support/SupportDialog';
import { Seo, OrganizationSchema, WebSiteSchema, WebApplicationSchema } from '@/components/seo';
import { PAGE_SEO } from '@/constants/seo';
import logoImage from '@/assets/images/logo.png';

export default function LandingPage(): React.JSX.Element {
  const { authUser } = useAuthContext();
  const isLoggedIn = !!authUser;
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        path={PAGE_SEO.home.path}
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <WebApplicationSchema />
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Remlic" className="size-8" />
            <span className="text-xl font-bold">Remlic</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSupportDialogOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Support
            </Button>
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Never Miss an
            <span className="block text-primary">Expiry Date Again</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Track and manage all your security compliance in one place. Remlic monitors expiry dates for
            PSIRA registrations, firearms licenses, vehicle discs, and training certificates - alerting you before
            anything expires.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
            )}
            <Button size="lg" variant="outline" onClick={() => setSupportDialogOpen(true)}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What You Can Do</h2>
            <p className="mt-4 text-muted-foreground">
              Manage all your security compliance records with full CRUD functionality
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Shield className="size-10 text-primary" />
                <CardTitle className="mt-4">PSIRA Officers</CardTitle>
                <CardDescription>
                  Look up officers directly from the PSIRA database using their ID number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Search className="size-4 text-primary" />
                    Auto-lookup by ID number
                  </li>
                  <li className="flex items-center gap-2">
                    <Plus className="size-4 text-primary" />
                    Save officers to your list
                  </li>
                  <li className="flex items-center gap-2">
                    <Bell className="size-4 text-primary" />
                    Track registration expiry
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="size-10 text-primary" />
                <CardTitle className="mt-4">Firearms</CardTitle>
                <CardDescription>
                  Full management of firearms with license expiry tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Plus className="size-4 text-primary" />
                    Add firearms with details
                  </li>
                  <li className="flex items-center gap-2">
                    <Edit className="size-4 text-primary" />
                    Edit and update records
                  </li>
                  <li className="flex items-center gap-2">
                    <Search className="size-4 text-primary" />
                    Search by serial number
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Car className="size-10 text-primary" />
                <CardTitle className="mt-4">Vehicles</CardTitle>
                <CardDescription>
                  Track vehicle license disc expiry dates and registration details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Plus className="size-4 text-primary" />
                    Add vehicle records
                  </li>
                  <li className="flex items-center gap-2">
                    <Edit className="size-4 text-primary" />
                    Update vehicle info
                  </li>
                  <li className="flex items-center gap-2">
                    <Search className="size-4 text-primary" />
                    Search by registration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="size-10 text-primary" />
                <CardTitle className="mt-4">Certificates</CardTitle>
                <CardDescription>
                  Manage training certificates and track when they expire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Plus className="size-4 text-primary" />
                    Add certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <Edit className="size-4 text-primary" />
                    Edit certificate details
                  </li>
                  <li className="flex items-center gap-2">
                    <Bell className="size-4 text-primary" />
                    Expiry notifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Simple Pricing</h2>
            <p className="mt-4 text-muted-foreground">Choose the plan that works for you</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Flexible, cancel anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R50</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Link to={isLoggedIn ? '/dashboard' : '/signup'}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Best Value
                </span>
              </div>
              <CardHeader>
                <CardTitle>Yearly</CardTitle>
                <CardDescription>Save R100 (2 months free)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R500</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <Link to={isLoggedIn ? '/dashboard' : '/signup'}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">The Problem We Solve</h2>
              <p className="mt-4 text-muted-foreground">
                Security companies juggle dozens of expiry dates across PSIRA registrations, firearm licenses,
                vehicle discs, and training certificates. Missing just one can mean fines, license suspensions,
                or worse.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Unified Expiry Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      See all upcoming expirations in one place. Filter by record type, time period, and sort by urgency.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Color-Coded Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Instantly spot expired (red) and expiring soon (orange) records. Never be caught off guard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Flexible Time Ranges</h3>
                    <p className="text-sm text-muted-foreground">
                      View expirations for the next 30, 60, 90, 180, or 365 days. Plan ahead on your terms.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Customizable Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure reminder settings for each record type. Choose exactly when to be notified - 7, 14, 30, or 60 days before expiry.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Expiry Dashboard Preview</CardTitle>
                  <CardDescription>See what's expiring at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-red-50 p-3 dark:bg-red-950/30">
                    <div className="flex items-center gap-2">
                      <Shield className="size-4" />
                      <span className="text-sm font-medium">John Doe - PSIRA</span>
                    </div>
                    <span className="text-xs text-destructive">Expired 3 days ago</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-orange-500/50 bg-orange-50 p-3 dark:bg-orange-950/30">
                    <div className="flex items-center gap-2">
                      <Target className="size-4" />
                      <span className="text-sm font-medium">Glock 17 - Firearm</span>
                    </div>
                    <span className="text-xs text-orange-600">Expires in 12 days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-orange-500/50 bg-orange-50 p-3 dark:bg-orange-950/30">
                    <div className="flex items-center gap-2">
                      <Car className="size-4" />
                      <span className="text-sm font-medium">CA 123-456 - Vehicle</span>
                    </div>
                    <span className="text-xs text-orange-600">Expires in 28 days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-4" />
                      <span className="text-sm font-medium">First Aid Cert</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Expires in 45 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Start Tracking Your Compliance Today</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Add your PSIRA officers, firearms, vehicles, and certificates. See all your expiring records
            in one unified dashboard.
          </p>
          <div className="mt-8">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImage} alt="Remlic" className="size-6" />
              <span className="font-semibold">Remlic</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms and Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Remlic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <SupportDialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen} />
    </div>
  );
}
