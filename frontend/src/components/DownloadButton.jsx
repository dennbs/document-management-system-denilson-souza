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
    <button type="button" onClick={handleDownload} disabled={isDownloading} style={styles.button}>
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}

const styles = {
  button: { background: '#fff', border: '1px solid #0f6b5b', borderRadius: '4px', color: '#075447', cursor: 'pointer', font: 'inherit', fontWeight: 700, padding: '8px 12px' },
};