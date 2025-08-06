'use client';

import { useState } from 'react';
import { useInventory } from '@/context/inventory-context';
import type { Repair } from '@/lib/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddRepairForm } from './add-repair-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function RepairsClient() {
  const { repairs } = useInventory();
  const [isAddRepairOpen, setAddRepairOpen] = useState(false);

  const getStatusVariant = (status: Repair['status']) => {
    switch (status) {
      case 'Pending':
        return 'outline';
      case 'In Progress':
        return 'secondary';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={isAddRepairOpen} onOpenChange={setAddRepairOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة إصلاح جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة إصلاح جديد</DialogTitle>
            </DialogHeader>
            <AddRepairForm onFinished={() => setAddRepairOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>قائمة الإصلاحات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الجهاز</TableHead>
                <TableHead>المشكلة</TableHead>
                <TableHead>التكلفة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.length > 0 ? (
                repairs.map((repair) => (
                  <TableRow key={repair.id}>
                    <TableCell>
                      <div className="font-medium">{repair.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {repair.customerPhone}
                      </div>
                    </TableCell>
                    <TableCell>{repair.device}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {repair.issueDescription}
                    </TableCell>
                    <TableCell>${repair.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(repair.status)}>
                        {repair.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(repair.creationDate).toLocaleDateString('ar-DZ')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center"
                  >
                    لا توجد إصلاحات حالية.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
