const API_PREFIX = '/api';

async function getErrorMessage(response) {
  const body = await response.json().catch(() => null);
  return body?.erro || 'Não foi possível concluir a operação.';
}

export async function uploadDocument({ file, owner }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('owner', owner);

  const response = await fetch(`${API_PREFIX}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_PREFIX}/documents`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function downloadDocument(document) {
  const response = await fetch(`${API_PREFIX}/documents/${document.id}/download`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const fileUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = document.originalName;
  link.click();
  URL.revokeObjectURL(fileUrl);
}