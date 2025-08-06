export type Product = {
  id: string;
  name: string;
  barcode: string;
  description: string;
  quantity: number;
  price: number;
  category: 'General' | 'Phone Accessories & Parts';
  image?: string;
};

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Screen Replacement',
    barcode: '1111111111111',
    description: 'High-quality OLED screen replacement for iPhone 13.',
    quantity: 10,
    price: 129.99,
    category: 'Phone Accessories & Parts',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21 Battery',
    barcode: '2222222222222',
    description: 'Original replacement battery for Samsung Galaxy S21.',
    quantity: 15,
    price: 49.99,
    category: 'Phone Accessories & Parts',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '3',
    name: 'USB-C Charging Cable',
    barcode: '3333333333333',
    description: '3ft braided USB-C to USB-A charging cable.',
    quantity: 50,
    price: 12.50,
    category: 'Phone Accessories & Parts',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '4',
    name: 'Generic Smartphone Case',
    barcode: '4444444444444',
    description: 'Clear TPU protective case for various smartphone models.',
    quantity: 1,
    price: 9.99,
    category: 'Phone Accessories & Parts',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '5',
    name: 'Premium Soda Can',
    barcode: '5555555555555',
    description: 'A refreshing can of premium soda.',
    quantity: 100,
    price: 1.99,
    category: 'General',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '6',
    name: 'Gourmet Coffee Beans',
    barcode: '6666666666666',
    description: '1lb bag of whole bean, dark roast coffee.',
    quantity: 30,
    price: 18.00,
    category: 'General',
    image: 'https://placehold.co/400x400.png',
  },
  {
    id: '7',
    name: 'Artisanal Bread Loaf',
    barcode: '7777777777777',
    description: 'Freshly baked sourdough bread.',
    quantity: 1,
    price: 7.50,
    category: 'General',
    image: 'https://placehold.co/400x400.png',
  }
];
