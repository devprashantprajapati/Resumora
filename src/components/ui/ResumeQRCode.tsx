import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ResumeQRCodeProps {
  settings: any;
  color?: string;
}

export function ResumeQRCode({ settings, color = '#18181b' }: ResumeQRCodeProps) {
  if (!settings.showQrCode) return null;

  // Since we also want it to display while editing even if it isn't published yet,
  // we default to a preview URL or the real published one.
  const url = `${window.location.origin}/p/${settings.publishedSlug || 'preview'}`;

  return (
    <div className="flex flex-col items-center justify-center gap-1 opacity-90 shrink-0 bg-white p-2 border border-zinc-100 rounded-lg shadow-sm">
      <QRCodeSVG value={url} size={64} fgColor={color} />
      <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider block text-center">Scan Me</span>
    </div>
  );
}
