'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  Package
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin-page') {
      return pathname === '/admin-page';
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        <Link href="/admin-page">
          <Button
            variant={isActive('/admin-page') && pathname === '/admin-page' ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link href="/admin-page/client-requests">
          <Button
            variant={isActive('/admin-page/client-requests') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Users className="h-4 w-4 mr-2" />
            Client Requests
          </Button>
        </Link>
        <Link href="/admin-page/deliverables">
          <Button
            variant={isActive('/admin-page/deliverables') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Package className="h-4 w-4 mr-2" />
            Deliverables
          </Button>
        </Link>
        <Link href="/admin-page/documents">
          <Button
            variant={isActive('/admin-page/documents') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
        </Link>
        <Link href="/admin-page/email-submissions">
          <Button
            variant={isActive('/admin-page/email-submissions') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Submissions
          </Button>
        </Link>
        <Link href="/admin-page">
          <Button
            variant={isActive('/admin-page') && pathname?.includes('settings') ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </Link>
      </nav>
    </aside>
  );
}

