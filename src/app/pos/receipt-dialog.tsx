'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/inventory';
import { Receipt } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface CartItem extends Product {
  cartQuantity: number;
}

interface ReceiptDialogProps {
  sale: {
    cart: CartItem[];
    total: number;
  };
}

class ReceiptToPrint extends React.Component<ReceiptDialogProps> {
    render() {
        const { sale } = this.props;
        return (
            <div className="p-8 font-sans text-black">
                <h2 className="text-2xl font-bold text-center mb-4">فاتورة البيع</h2>
                <p className="text-center mb-6">{new Date().toLocaleString('ar-DZ')}</p>
                <Separator className="my-4 bg-gray-400" />
                <div className="space-y-2 mb-4">
                    {sale.cart.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <span className="truncate max-w-[200px]">{item.name} ({item.cartQuantity})</span>
                            <span>${(item.price * item.cartQuantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <Separator className="my-4 bg-gray-400" />
                <div className="flex justify-between font-bold text-lg">
                    <span>المجموع</span>
                    <span>${sale.total.toFixed(2)}</span>
                </div>
                <p className="text-center mt-8 text-sm">شكرا لزيارتكم!</p>
            </div>
        );
    }
}


export function ReceiptDialog({ sale }: ReceiptDialogProps) {
    const componentRef = React.useRef<ReceiptToPrint>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `فاتورة - ${new Date().toISOString()}`,
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Receipt className="ml-2 h-4 w-4" />
          عرض الفاتورة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-foreground">
        <DialogHeader>
          <DialogTitle>فاتورة البيع</DialogTitle>
        </DialogHeader>
        <div className="print-container">
          <ReceiptToPrint ref={componentRef} sale={sale} />
        </div>
        <DialogFooter>
            <Button onClick={handlePrint} className="w-full">
                <Receipt className="ml-2 h-4 w-4" />
                طباعة الفاتورة
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
