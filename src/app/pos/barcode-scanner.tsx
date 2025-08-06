'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { BarcodeDetector, DetectedBarcode } from "barcode-detector";

declare global {
  interface Window {
    BarcodeDetector: {
      new (options?: { formats: string[] }): BarcodeDetector;
      getSupportedFormats(): Promise<string[]>;
    };
  }
}

interface BarcodeScannerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScanner({ isOpen, onOpenChange, onScanSuccess }: BarcodeScannerProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isBarcodeDetectorSupported, setIsBarcodeDetectorSupported] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if ('BarcodeDetector' in window) {
      setIsBarcodeDetectorSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Stop camera stream when dialog is closed
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setDetectedBarcode(null); // Reset detected barcode
      return;
    }
    
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'تم رفض الوصول إلى الكاميرا',
          description: 'يرجى تمكين أذونات الكاميرا في متصفحك لاستخدام هذه الميزة.',
        });
      }
    };
    getCameraPermission();
  }, [isOpen, toast]);
  
  useEffect(() => {
      if (!isOpen || !hasCameraPermission || !isBarcodeDetectorSupported || detectedBarcode) {
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
          }
          return;
      }

      const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'qr_code', 'code_128'] });

      const detectBarcode = async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                  const barcodes = await barcodeDetector.detect(videoRef.current);
                  if (barcodes.length > 0 && !detectedBarcode) {
                      setDetectedBarcode(barcodes[0].rawValue);
                      onScanSuccess(barcodes[0].rawValue);
                  }
              } catch (error) {
                  console.error("Barcode detection failed:", error);
              }
          }
          if (!detectedBarcode) {
            animationFrameId.current = requestAnimationFrame(detectBarcode);
          }
      };
      
      detectBarcode();

      return () => {
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
          }
      };

  }, [isOpen, hasCameraPermission, isBarcodeDetectorSupported, onScanSuccess, detectedBarcode]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مسح الباركود</DialogTitle>
          <DialogDescription>
            وجّه الكاميرا إلى الباركود للمسح.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video">
          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
          {hasCameraPermission === null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          {detectedBarcode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-md">
                  <div className="text-center text-white">
                      <p className="text-lg font-bold">تم اكتشاف الباركود:</p>
                      <p className="text-xl font-mono bg-white text-black p-2 rounded-md my-2">{detectedBarcode}</p>
                      <p>جارٍ إضافة المنتج إلى السلة...</p>
                  </div>
              </div>
          )}
        </div>
        {!isBarcodeDetectorSupported && (
            <Alert variant="destructive">
              <AlertTitle>المتصفح غير مدعوم</AlertTitle>
              <AlertDescription>
                متصفحك لا يدعم اكتشاف الباركود. جرب متصفحًا حديثًا مثل Chrome.
              </AlertDescription>
            </Alert>
        )}
        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTitle>الوصول إلى الكاميرا مطلوب</AlertTitle>
            <AlertDescription>
              يرجى السماح بالوصول إلى الكاميرا لاستخدام هذه الميزة.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
