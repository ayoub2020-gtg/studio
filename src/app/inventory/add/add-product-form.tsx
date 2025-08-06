'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/context/inventory-context';
import { generateBarcode } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateProductImage } from '@/ai/flows/generate-product-image';
import { Wand2, Loader2, RefreshCw } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  barcode: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  quantity: z.coerce.number().int().min(0, { message: "Quantity cannot be negative." }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  category: z.enum(['General', 'Phone Accessories & Parts']),
  image: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AddProductForm() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { addProduct } = useInventory();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      barcode: '',
      description: '',
      quantity: 0,
      price: 0.0,
      category: 'General',
      image: '',
    },
  });

  const handleGenerateBarcode = () => {
    form.setValue('barcode', generateBarcode());
  };

  const handleGenerateImage = async () => {
    const productName = form.getValues('name');
    const productDescription = form.getValues('description');
    if (!productName || !productDescription) {
      toast({
        variant: 'destructive',
        title: 'Cannot Generate Image',
        description: 'Please provide a product name and description first.',
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await generateProductImage({ productName, productDescription });
      if (result.imageUrl) {
        form.setValue('image', result.imageUrl);
        toast({ title: 'Image Generated Successfully' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description: 'Could not generate an image. Please try again.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const finalData = {
        ...data,
        barcode: data.barcode || generateBarcode(),
    }
    addProduct(finalData);
    toast({
      title: 'Product Added',
      description: `${data.name} has been successfully added to the inventory.`,
    });
    router.push('/inventory');
  };

  const imageUrl = form.watch('image');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., iPhone 14 Pro Case" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode (optional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Scan or enter barcode" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleGenerateBarcode}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed product description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Phone Accessories & Parts">Phone Accessories & Parts</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Card className="overflow-hidden">
                    <CardHeader className="p-2 sm:p-4">
                        <FormLabel>Product Image</FormLabel>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4 pt-0">
                        <div className="aspect-square relative bg-muted rounded-md flex items-center justify-center">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Generated product" layout="fill" objectFit="cover" className="rounded-md" />
                            ) : (
                                <span className="text-sm text-muted-foreground">No Image</span>
                            )}
                            {isGeneratingImage && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                         <Button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full mt-2">
                          {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                          Generate with AI
                        </Button>
                    </CardContent>
                </Card>

            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" size="lg">Add Product</Button>
        </div>
      </form>
    </Form>
  );
}
