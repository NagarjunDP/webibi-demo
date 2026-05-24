/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download } from "lucide-react";

interface Props {
  demo: any;
  onClose: () => void;
}

export default function QRModal({ demo, onClose }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!demo) return null;

  const liveUrl = demo.liveUrl || `https://demo.webibi.tech/demos/${demo.slug}`;

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${demo.businessName}-QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 truncate pr-4">
            {demo.businessName} QR
          </h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-8 flex flex-col items-center">
          <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <QRCodeCanvas 
              value={liveUrl} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#0f172a"}
              level={"Q"}
              marginSize={1}
            />
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            Scan to view the free demo on any device.
          </p>
          
          <button
            onClick={downloadQR}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download size={18} />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
