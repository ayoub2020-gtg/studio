'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { initialProducts, type Product } from '@/lib/inventory';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface CartItem extends Product {
  cartQuantity: number;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  findProduct: (searchTerm: string) => Product | undefined;
  processSale: (cart: CartItem[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();

  const addProduct = useCallback((newProductData: Omit<Product, 'id'>) => {
    setProducts((prevProducts) => {
      const newProduct: Product = {
        ...newProductData,
        id: (prevProducts.length + 1).toString() + Date.now(),
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
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
          const newQuantity = updatedProducts[productIndex].quantity - cartItem.cartQuantity;
          updatedProducts[productIndex].quantity = newQuantity;

          if (newQuantity < 2) {
            lowStockItems.push(updatedProducts[productIndex].name);
          }
        }
      });
      return updatedProducts;
    });

    if (lowStockItems.length > 0) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle /> Low Stock Alert
          </div>
        ),
        description: `The following items are running low: ${lowStockItems.join(', ')}.`,
      });
    }

    toast({
        title: "Sale Complete",
        description: "The inventory has been updated successfully.",
    })

  }, [toast]);

  return (
    <InventoryContext.Provider value={{ products, addProduct, findProduct, processSale }}>
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
