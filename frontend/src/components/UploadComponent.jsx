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
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <label className="grid gap-1.5 font-semibold text-slate-700">
        Arquivo
        <input
          name="file"
          type="file"
          required
          disabled={isSubmitting}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="rounded border border-slate-300 p-2.5 file:mr-3 file:rounded file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:font-semibold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>
      <label className="grid gap-1.5 font-semibold text-slate-700">
        Proprietário
        <input
          name="owner"
          type="text"
          required
          value={owner}
          disabled={isSubmitting}
          onChange={(event) => setOwner(event.target.value)}
          className="rounded border border-slate-300 p-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-emerald-700 px-4 py-2.5 font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar documento'}
      </button>
    </form>
  );
}
