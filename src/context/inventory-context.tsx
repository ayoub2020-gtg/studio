'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { initialProducts, type Product, type Sale, type Repair } from '@/lib/inventory';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { isToday, isThisMonth } from 'date-fns';

interface CartItem extends Product {
  cartQuantity: number;
}

interface ManualFund {
    amount: number;
    date: Date;
}

interface InventoryContextType {
  products: Product[];
  sales: Sale[];
  repairs: Repair[];
  addProduct: (product: Omit<Product, 'id' | 'purchasePrice'> & { purchasePrice: number }) => void;
  addRepair: (repair: Omit<Repair, 'id' | 'creationDate'>) => void;
  findProduct: (searchTerm: string) => Product | undefined;
  processSale: (cart: CartItem[]) => void;
  addFunds: (amount: number) => void;
  capital: number;
  dailyProfit: number;
  monthlyProfit: number;
  totalRevenue: number;
  costOfGoodsSold: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [manualFunds, setManualFunds] = useState<ManualFund[]>([]);
  const { toast } = useToast();

  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'purchasePrice'> & { purchasePrice: number }) => {
    setProducts((prevProducts) => {
      const newProduct: Product = {
        ...newProductData,
        id: (prevProducts.length + 1).toString() + Date.now(),
        purchasePrice: newProductData.purchasePrice,
      };
      return [...prevProducts, newProduct];
    });
  }, []);

  const addRepair = useCallback((newRepairData: Omit<Repair, 'id' | 'creationDate'>) => {
    setRepairs((prevRepairs) => {
      const newRepair: Repair = {
        ...newRepairData,
        id: (prevRepairs.length + 1).toString() + Date.now(),
        creationDate: new Date(),
      };
      return [...prevRepairs, newRepair];
    });
  }, []);

  const findProduct = useCallback((searchTerm: string): Product | undefined => {
    const term = searchTerm.toLowerCase();
    return products.find(
      p => p.barcode === term || p.name.toLowerCase().includes(term)
    );
  }, [products]);
  
  const processSale = useCallback((cart: CartItem[]) => {
    let lowStockItems: string[] = [];
    let saleProfit = 0;
    let saleCost = 0;

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
          const product = updatedProducts[productIndex];
          const newQuantity = product.quantity - cartItem.cartQuantity;
          updatedProducts[productIndex].quantity = newQuantity;

          saleProfit += (product.price - product.purchasePrice) * cartItem.cartQuantity;
          saleCost += product.purchasePrice * cartItem.cartQuantity;

          if (newQuantity < 2) {
            lowStockItems.push(product.name);
          }
        }
      });
      return updatedProducts;
    });

    const newSale: Sale = {
        id: Date.now().toString(),
        items: cart,
        total: cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0),
        profit: saleProfit,
        cost: saleCost,
        date: new Date(),
    }
    setSales(prevSales => [...prevSales, newSale]);

    if (lowStockItems.length > 0) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle /> تنبيه انخفاض المخزون
          </div>
        ),
        description: `المنتجات التالية على وشك النفاد: ${lowStockItems.join(', ')}.`,
      });
    }

    toast({
        title: "اكتمل البيع",
        description: "تم تحديث المخزون بنجاح.",
    })

  }, [toast]);
  
  const addFunds = useCallback((amount: number) => {
    if (amount > 0) {
        setManualFunds(prevFunds => [...prevFunds, { amount, date: new Date() }]);
    }
  }, []);

  const costOfGoodsSold = useMemo(() => {
    return sales.reduce((acc, sale) => acc + (sale.cost || 0), 0);
  }, [sales]);

  const dailyProfit = useMemo(() => {
    const salesProfit = sales
        .filter(sale => isToday(sale.date))
        .reduce((acc, sale) => acc + sale.profit, 0);
    const fundsToday = manualFunds
        .filter(fund => isToday(fund.date))
        .reduce((acc, fund) => acc + fund.amount, 0);
    return salesProfit + fundsToday;
  }, [sales, manualFunds]);

  const monthlyProfit = useMemo(() => {
     const salesProfit = sales
        .filter(sale => isThisMonth(sale.date))
        .reduce((acc, sale) => acc + sale.profit, 0);
    const fundsThisMonth = manualFunds
        .filter(fund => isThisMonth(fund.date))
        .reduce((acc, fund) => acc + fund.amount, 0);
    return salesProfit + fundsThisMonth;
  }, [sales, manualFunds]);

  const totalManualFunds = useMemo(() => {
    return manualFunds.reduce((acc, fund) => acc + fund.amount, 0);
  }, [manualFunds]);

  const totalRevenue = useMemo(() => {
    const salesRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    return salesRevenue + totalManualFunds;
  }, [sales, totalManualFunds]);

  const capital = useMemo(() => {
    const inventoryValue = products.reduce((acc, product) => acc + (product.purchasePrice * product.quantity), 0);
    const salesRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    return inventoryValue + totalManualFunds + (salesRevenue - costOfGoodsSold);
  }, [products, sales, totalManualFunds, costOfGoodsSold]);


  return (
    <InventoryContext.Provider value={{ products, sales, repairs, addProduct, addRepair, findProduct, processSale, addFunds, capital, dailyProfit, monthlyProfit, totalRevenue, costOfGoodsSold }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
