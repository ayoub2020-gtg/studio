import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateBarcode(): string {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString().substring(2, 8);
  const combined = timestamp + randomPart;
  return combined.substring(0, 13).padEnd(13, '0');
}
