import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { downloadDocument, getDocuments, uploadDocument } from './services/documentService.js';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function loadDocuments() {
    setIsLoading(true);
    try {
      setDocuments(await getDocuments());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleUpload(data) {
    setIsSubmitting(true);
    setMessage('');
    try {
      const document = await uploadDocument(data);
      setDocuments((currentDocuments) => [document, ...currentDocuments]);
      setMessage('Documento enviado com sucesso.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownload(document) {
    setMessage('');
    try {
      await downloadDocument(document);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 border-b-4 border-orange-400 pb-5">
          <p className="m-0 font-mono text-sm font-bold uppercase tracking-wider text-emerald-700">
            Arquivo local
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
            Document Management System
          </h1>
        </header>
        <section aria-labelledby="upload-title" className="mb-8">
          <h2 id="upload-title" className="mb-4 text-xl font-semibold text-slate-800">
            Enviar documento
          </h2>
          <UploadComponent onUpload={handleUpload} isSubmitting={isSubmitting} />
        </section>
        {message && (
          <p role="status" className="mb-8 border-l-4 border-emerald-700 bg-emerald-50 px-4 py-3 text-slate-800">
            {message}
          </p>
        )}
        <section aria-labelledby="documents-title" className="mb-8">
          <h2 id="documents-title" className="mb-4 text-xl font-semibold text-slate-800">
            Documentos
          </h2>
          <DocumentList documents={documents} isLoading={isLoading} onDownload={handleDownload} />
        </section>
      </div>
    </main>
  );
}

