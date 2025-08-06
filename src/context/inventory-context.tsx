'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { initialProducts, type Product, type Sale } from '@/lib/inventory';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { isToday, isThisMonth } from 'date-fns';

interface CartItem extends Product {
  cartQuantity: number;
}

interface InventoryContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id' | 'purchasePrice'> & { purchasePrice: number }) => void;
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
  const [manualFunds, setManualFunds] = useState(0);
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
        setManualFunds(prevFunds => prevFunds + amount);
    }
  }, []);

  const capital = useMemo(() => {
    const inventoryValue = products.reduce((acc, product) => acc + (product.purchasePrice * product.quantity), 0);
    return inventoryValue + manualFunds;
  }, [products, manualFunds]);

  const dailyProfit = useMemo(() => {
    return sales
        .filter(sale => isToday(sale.date))
        .reduce((acc, sale) => acc + sale.profit, 0);
  }, [sales]);

  const monthlyProfit = useMemo(() => {
     return sales
        .filter(sale => isThisMonth(sale.date))
        .reduce((acc, sale) => acc + sale.profit, 0);
  }, [sales]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, sale) => acc + sale.total, 0);
  }, [sales]);

  const costOfGoodsSold = useMemo(() => {
    return sales.reduce((acc, sale) => acc + (sale.cost || 0), 0);
  }, [sales]);


  return (
    <InventoryContext.Provider value={{ products, sales, addProduct, findProduct, processSale, addFunds, capital, dailyProfit, monthlyProfit, totalRevenue, costOfGoodsSold }}>
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
