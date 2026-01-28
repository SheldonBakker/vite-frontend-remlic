import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
