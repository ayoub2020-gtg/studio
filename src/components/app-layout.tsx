'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Home, Package, PackagePlus, PanelLeft, LayoutDashboard, ShoppingCart } from 'lucide-react';
import React from 'react';
import { SidebarInset, SidebarTrigger } from './ui/sidebar';

const menuItems = [
  { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/pos', label: 'نقطة البيع', icon: ShoppingCart },
  { href: '/inventory', label: 'المخزون', icon: Package },
  { href: '/inventory/add', label: 'إضافة منتج', icon: PackagePlus },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="right">
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="size-7 text-accent" />
              <span className="text-lg font-semibold">ساري</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-2 ${pathname === item.href ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </Button>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden">
             <PanelLeft className="h-5 w-5" />
             <span className="sr-only">Toggle menu</span>
          </SidebarTrigger>
          <div className="w-full flex-1">
            {/* Can add search or other header elements here */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
