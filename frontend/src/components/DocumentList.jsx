import DownloadButton from './DownloadButton.jsx';

function formatSize(size) {
  return new Intl.NumberFormat('pt-BR', { style: 'unit', unit: 'byte' }).format(size);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

export default function DocumentList({ documents, isLoading, onDownload }) {
  if (isLoading) {
    return <p>Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <ul style={styles.list}>
      {documents.map((document) => (
        <li key={document.id} style={styles.item}>
          <div>
            <strong>{document.originalName}</strong>
            <div style={styles.metadata}>
              {document.owner} · {formatSize(document.size)} · {formatDate(document.uploadedAt)}
            </div>
          </div>
          <DownloadButton document={document} onDownload={onDownload} />
        </li>
      ))}
    </ul>
  );
}

const styles = {
  list: { display: 'grid', gap: '10px', listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'center', borderBottom: '1px solid #d8dacf', display: 'flex', gap: '16px', justifyContent: 'space-between', padding: '14px 0' },
  metadata: { color: '#586158', fontSize: '0.9rem', marginTop: '5px' },
};