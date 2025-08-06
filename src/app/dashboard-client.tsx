'use client';

import { useInventory } from '@/context/inventory-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp } from 'lucide-react';

export function DashboardClient() {
  const { capital, dailyProfit, monthlyProfit } = useInventory();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رأس المال</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${capital.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
                القيمة الإجمالية للمخزون
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ربح اليوم</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${dailyProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
                إجمالي الربح المحقق اليوم
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ربح الشهر</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${monthlyProfit.toFixed(2)}</div>
             <p className="text-xs text-muted-foreground">
                إجمالي الربح المحقق هذا الشهر
            </p>
            </CardContent>
        </Card>
    </div>
  );
}
