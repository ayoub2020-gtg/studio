import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/app-layout';
import { InventoryProvider } from '@/context/inventory-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'مدير مخزون ساري',
  description: 'تطبيق لإدارة المخزون يشبه تطبيقات سطح المكتب.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <InventoryProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </InventoryProvider>
        <Toaster />
      </body>
    </html>
  );
}
