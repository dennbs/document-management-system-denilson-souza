import { useState } from 'react';

export default function UploadComponent({ onUpload, isSubmitting }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file || !owner.trim()) {
      return;
    }

    await onUpload({ file, owner: owner.trim() });
    setFile(null);
    setOwner('');
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Arquivo
        <input
          name="file"
          type="file"
          required
          disabled={isSubmitting}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Proprietário
        <input
          name="owner"
          type="text"
          required
          value={owner}
          disabled={isSubmitting}
          onChange={(event) => setOwner(event.target.value)}
          style={styles.input}
        />
      </label>
      <button type="submit" disabled={isSubmitting} style={styles.button}>
        {isSubmitting ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'grid', gap: '16px' },
  label: { display: 'grid', gap: '6px', fontWeight: 600 },
  input: { border: '1px solid #b5b9ad', borderRadius: '4px', padding: '10px', font: 'inherit' },
  button: { background: '#0f6b5b', border: 0, borderRadius: '4px', color: '#fff', cursor: 'pointer', font: 'inherit', fontWeight: 700, padding: '11px 16px' },
};