'use client';

import Image from 'next/image';
import { useInventory } from '@/context/inventory-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/inventory';
import { AlertCircle } from 'lucide-react';

export function InventoryClient() {
  const { products } = useInventory();

  const renderProductTable = (productList: Product[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productList.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt={product.name}
                className="aspect-square rounded-md object-cover"
                height="64"
                src={product.image || 'https://placehold.co/64x64.png'}
                width="64"
                data-ai-hint="product image"
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{product.category}</Badge>
            </TableCell>
            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              {product.quantity < 2 ? (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit ml-auto">
                  <AlertCircle className="h-3 w-3" /> {product.quantity}
                </Badge>
              ) : (
                product.quantity
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="phone">Phone Accessories & Parts</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderProductTable(products)}
          </TabsContent>
          <TabsContent value="general">
            {renderProductTable(products.filter(p => p.category === 'General'))}
          </TabsContent>
          <TabsContent value="phone">
            {renderProductTable(products.filter(p => p.category === 'Phone Accessories & Parts'))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
