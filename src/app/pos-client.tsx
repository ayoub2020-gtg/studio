'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useInventory } from '@/context/inventory-context';
import type { Product } from '@/lib/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

interface CartItem extends Product {
  cartQuantity: number;
}

export function POSClient() {
  const { findProduct, processSale } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const product = findProduct(searchTerm);
    return product ? [product] : [];
  }, [searchTerm, findProduct]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if(existingItem.cartQuantity < product.quantity) {
            return prevCart.map((item) =>
            item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
            );
        }
        return prevCart;
      }
      if(product.quantity > 0) {
        return [...prevCart, { ...product, cartQuantity: 1 }];
      }
      return prevCart;
    });
    setSearchTerm('');
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      const itemToUpdate = prevCart.find(item => item.id === productId);
      if (itemToUpdate && newQuantity > itemToUpdate.quantity) {
        return prevCart;
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
    });
  };
  
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  }, [cart]);

  const handleSale = () => {
    processSale(cart);
    setCart([]);
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Scan barcode or type product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-lg h-12"
          />
        </div>

        {searchTerm && (
          <Card>
            <CardContent className="p-2">
              {searchResults.length > 0 ? (
                searchResults.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => addToCart(product)}>
                    <div className="flex items-center gap-4">
                      <Image src={product.image || 'https://placehold.co/64x64.png'} alt={product.name} width={40} height={40} className="rounded-md" data-ai-hint="product image" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">In stock: {product.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-muted-foreground">No products found.</p>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className='pt-4'>
            <h3 className="text-xl font-semibold mb-4">Direct Scan & Sell</h3>
            <p className="text-muted-foreground mb-4">Focus the input above and scan a barcode to add it directly to the cart. This feature streamlines quick sales.</p>
        </div>

      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
            {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <p>Cart is empty</p>
                </div>
            ) : (
                <>
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableBody>
                        {cart.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <p className="font-medium truncate max-w-[120px]">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}><Minus className="h-3 w-3" /></Button>
                                        <span>{item.cartQuantity}</span>
                                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)} disabled={item.cartQuantity >= item.quantity}><Plus className="h-3 w-3" /></Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ${(item.price * item.cartQuantity).toFixed(2)}
                                </TableCell>
                                <TableCell className="p-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateCartQuantity(item.id, 0)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="space-y-2 text-lg">
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
                <Button size="lg" className="w-full mt-6" onClick={handleSale} disabled={cart.length === 0}>
                    Complete Sale
                </Button>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
