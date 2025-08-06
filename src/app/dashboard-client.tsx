'use client';

import { useInventory } from '@/context/inventory-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp, AlertCircle, ShoppingCart, ListChecks } from 'lucide-react';
import type { Product, Sale } from '@/lib/inventory';
import { ReceiptDialog } from './pos/receipt-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DashboardClient() {
  const { capital, dailyProfit, monthlyProfit, products, sales } = useInventory();

  const lowStockProducts = products.filter(p => p.quantity < 2);
  const recentSales = sales.slice(-5).reverse();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              أحدث المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>المنتجات</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead className="text-right">الفاتورة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{new Date(sale.date).toLocaleDateString('ar-DZ')}</TableCell>
                          <TableCell>{sale.items.reduce((acc, i) => acc + i.cartQuantity, 0)}</TableCell>
                          <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <ReceiptDialog sale={sale} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
            ) : (
                <div className="text-center text-muted-foreground py-12">
                    <p>لا توجد مبيعات حديثة.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              المنتجات المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المنتج</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right">
                              <Badge variant="destructive" className="flex items-center gap-1 w-fit ml-auto">
                                <AlertCircle className="h-3 w-3" /> {product.quantity}
                              </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
            ) : (
                <div className="text-center text-muted-foreground py-12">
                    <p>لا توجد منتجات منخفضة المخزون.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
