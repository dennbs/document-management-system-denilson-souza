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
    <main style={styles.page}>
      <div style={styles.content}>
        <header style={styles.header}>
          <p style={styles.eyebrow}>Arquivo local</p>
          <h1 style={styles.title}>Document Management System</h1>
        </header>
        <section aria-labelledby="upload-title" style={styles.section}>
          <h2 id="upload-title" style={styles.heading}>Enviar documento</h2>
          <UploadComponent onUpload={handleUpload} isSubmitting={isSubmitting} />
        </section>
        {message && <p role="status" style={styles.message}>{message}</p>}
        <section aria-labelledby="documents-title" style={styles.section}>
          <h2 id="documents-title" style={styles.heading}>Documentos</h2>
          <DocumentList documents={documents} isLoading={isLoading} onDownload={handleDownload} />
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { background: '#f4f2e8', color: '#18332d', fontFamily: 'Georgia, serif', minHeight: '100vh', padding: '48px 20px' },
  content: { margin: '0 auto', maxWidth: '760px' },
  header: { borderBottom: '4px solid #d7783e', marginBottom: '32px', paddingBottom: '20px' },
  eyebrow: { color: '#0f6b5b', fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' },
  title: { fontSize: '2.25rem', margin: '8px 0 0' },
  section: { marginBottom: '32px' },
  heading: { fontSize: '1.25rem', marginBottom: '16px' },
  message: { background: '#e0eee8', borderLeft: '4px solid #0f6b5b', margin: '0 0 32px', padding: '12px 16px' },
};
