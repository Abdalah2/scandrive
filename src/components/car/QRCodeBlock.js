import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from '../common/Button';

export default function QRCodeBlock({ value, label = 'QR Code ScanDrive' }) {
  const canvasRef = useRef(null);

  const downloadQr = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scandrive-qr.png';
    link.click();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500 break-all">{value}</p>
        </div>
        <Button variant="secondary" onClick={downloadQr}>Télécharger</Button>
      </div>
      <div className="mt-4 flex justify-center rounded-2xl bg-slate-50 p-4">
        <QRCodeCanvas ref={canvasRef} value={value} size={180} bgColor="#f8fafc" fgColor="#102b4f" includeMargin />
      </div>
    </div>
  );
}