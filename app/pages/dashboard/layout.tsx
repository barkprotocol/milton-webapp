import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Milton',
  description: 'Your Milton ecosystem dashboard - Track your MILTON tokens, NFTs, and more!',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
