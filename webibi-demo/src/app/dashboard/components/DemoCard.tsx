/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, Clock, Smartphone, ExternalLink, QrCode, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  demo: any;
  onShowQR: (demo: any) => void;
}

export default function DemoCard({ demo, onShowQR }: Props) {
  const isExpired = demo.expired;
  
  // Format last active time
  const lastActiveText = demo.lastActive 
    ? formatDistanceToNow(new Date(demo.lastActive), { addSuffix: true })
    : "Never";

  // Format expires in time
  const expiresText = demo.expiresAt
    ? formatDistanceToNow(new Date(demo.expiresAt), { addSuffix: false })
    : "Unknown";

  const businessName = demo.businessName || "Unknown Business";
  const industry = demo.industry || "Business";
  const city = demo.city || "Unknown City";
  
  const liveUrl = demo.liveUrl || `https://demo.webibi.tech/demos/${demo.slug}`;
  
  // Construct WhatsApp Messages
  const whatsappAgentShare = `https://wa.me/?text=${encodeURIComponent(`Hi! Here's your free demo website: ${liveUrl} — Valid for 7 days only! 🌟`)}`;
  const whatsappAgencyContact = `https://wa.me/${process.env.NEXT_PUBLIC_AGENCY_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(`Hi! My demo for ${businessName} has expired. I'm interested in getting the full website!`)}`;

  return (
    <div className={`relative bg-white rounded-xl border p-4 shadow-sm transition-all mb-4 ${isExpired ? 'opacity-60 grayscale' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
          {demo.logoUrl ? (
            <img src={demo.logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
          ) : (
            <span className="font-bold text-lg text-primary">{businessName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 truncate text-base">{businessName}</h3>
            {isExpired && (
              <span className="shrink-0 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ml-2">
                Expired
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate capitalize">{industry} • {city}</p>
        </div>
      </div>

      {/* Analytics Strip */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Eye size={16} className="text-blue-500" />
          {demo.opensCount || 0} opens
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Clock size={16} className="text-amber-500" />
          {demo.totalMinutes ? demo.totalMinutes.toFixed(1) : "0"} mins
        </div>
        {!isExpired && demo.device && (
          <div className="flex items-center gap-1.5 font-medium">
            <Smartphone size={16} className="text-purple-500" />
            {demo.device}
          </div>
        )}
      </div>

      {!isExpired && (
        <>
          <div className="mt-2 text-xs text-gray-400 font-medium">
            Last seen: {lastActiveText}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-500">
            ⏰ Expires in {expiresText}
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        {isExpired ? (
          <a
            href={whatsappAgencyContact}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={18} /> Contact webibi.tech
          </a>
        ) : (
          <>
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={16} /> View
            </a>
            <button
              onClick={() => onShowQR(demo)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 text-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <QrCode size={16} /> QR
            </button>
            <a
              href={whatsappAgentShare}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle size={16} /> Share
            </a>
          </>
        )}
      </div>
    </div>
  );
}
