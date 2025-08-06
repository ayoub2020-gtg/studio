'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory } from '@/context/inventory-context';
import { useToast } from '@/hooks/use-toast';

const repairSchema = z.object({
  customerName: z.string().min(3, { message: 'يجب أن يكون اسم العميل 3 أحرف على الأقل.' }),
  customerPhone: z.string().min(10, { message: 'رقم الهاتف غير صالح.' }),
  device: z.string().min(3, { message: 'يجب أن يكون اسم الجهاز 3 أحرف على الأقل.' }),
  issueDescription: z.string().min(10, { message: 'يجب أن يكون الوصف 10 أحرف على الأقل.' }),
  cost: z.coerce.number().min(0, { message: 'لا يمكن أن تكون التكلفة سالبة.' }),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']),
});

type RepairFormData = z.infer<typeof repairSchema>;

interface AddRepairFormProps {
  onFinished: () => void;
}

export function AddRepairForm({ onFinished }: AddRepairFormProps) {
  const { addRepair } = useInventory();
  const { toast } = useToast();

  const form = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      device: '',
      issueDescription: '',
      cost: 0.0,
      status: 'Pending',
    },
  });

  const onSubmit = (data: RepairFormData) => {
    addRepair(data);
    toast({
      title: 'تمت إضافة الإصلاح',
      description: `تمت إضافة إصلاح لجهاز ${data.device} بنجاح.`,
    });
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم العميل</FormLabel>
                <FormControl>
                  <Input placeholder="اسم العميل الكامل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف العميل</FormLabel>
                <FormControl>
                  <Input placeholder="05xxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="device"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجهاز</FormLabel>
              <FormControl>
                <Input placeholder="مثال: iPhone 13 Pro Max" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="issueDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشكلة</FormLabel>
              <FormControl>
                <Textarea placeholder="وصف مفصل لمشكلة الجهاز..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تكلفة الإصلاح</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">قيد الانتظار</SelectItem>
                    <SelectItem value="In Progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="Completed">مكتمل</SelectItem>
                    <SelectItem value="Cancelled">ملغى</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">إضافة إصلاح</Button>
        </div>
      </form>
    </Form>
  );
}
