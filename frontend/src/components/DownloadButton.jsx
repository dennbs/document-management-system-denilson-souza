import { useState } from 'react';

export default function DownloadButton({ document, onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await onDownload(document);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="whitespace-nowrap rounded border border-emerald-700 bg-white px-3 py-2 font-bold text-emerald-800 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}
