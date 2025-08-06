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
  name: z.string().min(3, { message: "يجب أن يكون اسم المنتج 3 أحرف على الأقل." }),
  barcode: z.string().optional(),
  description: z.string().min(10, { message: "يجب أن يكون الوصف 10 أحرف على الأقل." }),
  quantity: z.coerce.number().int().min(0, { message: "لا يمكن أن تكون الكمية سالبة." }),
  price: z.coerce.number().min(0, { message: "لا يمكن أن يكون السعر سالبًا." }),
  purchasePrice: z.coerce.number().min(0, { message: "لا يمكن أن يكون سعر الشراء سالبًا." }),
  category: z.enum(['عام', 'قطع غيار الهواتف', 'إكسسوارات الهواتف']),
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
      purchasePrice: 0.0,
      category: 'عام',
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
        title: 'لا يمكن إنشاء صورة',
        description: 'يرجى تقديم اسم المنتج ووصفه أولاً.',
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await generateProductImage({ productName, productDescription });
      if (result.imageUrl) {
        form.setValue('image', result.imageUrl);
        toast({ title: 'تم إنشاء الصورة بنجاح' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل إنشاء الصورة',
        description: 'لا يمكن إنشاء صورة. يرجى المحاولة مرة أخرى.',
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
      title: 'تمت إضافة المنتج',
      description: `تمت إضافة ${data.name} بنجاح إلى المخزون.`,
    });
    router.push('/inventory');
  };

  const imageUrl = form.watch('image');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المنتج</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: جراب آيفون 14 برو" {...field} />
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
                    <FormLabel>الباركود (اختياري)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="امسح أو أدخل الباركود" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleGenerateBarcode}>
                        <RefreshCw className="ml-2 h-4 w-4" /> إنشاء
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
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea placeholder="وصف مفصل للمنتج..." {...field} />
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
                        <FormLabel>سعر البيع</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="purchasePrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>سعر الشراء</FormLabel>
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
                        <FormLabel>كمية المخزون</FormLabel>
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
                    <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="اختر فئة" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="عام">عام</SelectItem>
                          <SelectItem value="قطع غيار الهواتف">قطع غيار الهواتف</SelectItem>
                          <SelectItem value="إكسسوارات الهواتف">إكسسوارات الهواتف</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Card className="overflow-hidden">
                    <CardHeader className="p-2 sm:p-4">
                        <FormLabel>صورة المنتج</FormLabel>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4 pt-0">
                        <div className="aspect-square relative bg-muted rounded-md flex items-center justify-center">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Generated product" layout="fill" objectFit="cover" className="rounded-md" />
                            ) : (
                                <span className="text-sm text-muted-foreground">لا توجد صورة</span>
                            )}
                            {isGeneratingImage && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                         <Button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full mt-2">
                          {isGeneratingImage ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
                          إنشاء باستخدام الذكاء الاصطناعي
                        </Button>
                    </CardContent>
                </Card>

            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" size="lg">إضافة منتج</Button>
        </div>
      </form>
    </Form>
  );
}
