export type Product = {
  id: string;
  name: string;
  barcode: string;
  description: string;
  quantity: number;
  price: number;
  purchasePrice: number;
  category: 'عام' | 'قطع غيار الهواتف' | 'إكسسوارات الهواتف';
  image?: string;
};

export type Sale = {
    id: string;
    items: (Product & { cartQuantity: number })[];
    total: number;
    profit: number;
    cost: number;
    date: Date;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'شاشة بديلة لآيفون 13',
    barcode: '1111111111111',
    description: 'شاشة OLED عالية الجودة بديلة لآيفون 13.',
    quantity: 10,
    price: 129.99,
    purchasePrice: 90,
    category: 'قطع غيار الهواتف',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '2',
    name: 'بطارية سامسونج جالاكسي S21',
    barcode: '2222222222222',
    description: 'بطارية بديلة أصلية لسامسونج جالاكسي S21.',
    quantity: 15,
    price: 49.99,
    purchasePrice: 30,
    category: 'قطع غيار الهواتف',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '3',
    name: 'كابل شحن USB-C',
    barcode: '3333333333333',
    description: 'كابل شحن مجدول بطول 1 متر USB-C إلى USB-A.',
    quantity: 50,
    price: 12.50,
    purchasePrice: 5,
    category: 'إكسسوارات الهواتف',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '4',
    name: 'جراب هاتف ذكي عام',
    barcode: '4444444444444',
    description: 'جراب حماية شفاف من مادة TPU لمختلف موديلات الهواتف الذكية.',
    quantity: 1,
    price: 9.99,
    purchasePrice: 3,
    category: 'إكسسوارات الهواتف',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '5',
    name: 'علبة صودا فاخرة',
    barcode: '5555555555555',
    description: 'علبة منعشة من الصودا الفاخرة.',
    quantity: 100,
    price: 1.99,
    purchasePrice: 0.5,
    category: 'عام',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '6',
    name: 'حبوب بن جورميه',
    barcode: '6666666666666',
    description: 'كيس 1 رطل من حبوب البن الكاملة المحمصة الداكنة.',
    quantity: 30,
    price: 18.00,
    purchasePrice: 10,
    category: 'عام',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '7',
    name: 'رغيف خبز حرفي',
    barcode: '7777777777777',
    description: 'خبز العجين المخمر المخبوز طازجًا.',
    quantity: 1,
    price: 7.50,
    purchasePrice: 2.5,
    category: 'عام',
    image: 'https://placehold.co/400x400.png',
  }
];
