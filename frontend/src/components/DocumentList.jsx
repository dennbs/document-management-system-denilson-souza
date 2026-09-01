import DownloadButton from './DownloadButton.jsx';

function formatSize(size) {
  return new Intl.NumberFormat('pt-BR', { style: 'unit', unit: 'byte' }).format(size);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

export default function DocumentList({ documents, isLoading, onDownload }) {
  if (isLoading) {
    return <p className="text-slate-500">Carregando documentos...</p>;
  }

  if (documents.length === 0) {
    return <p className="text-slate-500">Nenhum documento enviado ainda.</p>;
  }

  return (
    <ul className="grid gap-2.5 divide-y divide-slate-200">
      {documents.map((document) => (
        <li key={document.id} className="flex flex-col gap-3 py-3.5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="text-slate-800">{document.originalName}</strong>
            <div className="mt-1 text-sm text-slate-500">
              {document.owner} · {formatSize(document.size)} · {formatDate(document.uploadedAt)}
            </div>
          </div>
          <DownloadButton document={document} onDownload={onDownload} />
        </li>
      ))}
    </ul>
  );
}
