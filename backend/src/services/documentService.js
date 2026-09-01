// Regras de negócio para documentos: cria metadados a partir do arquivo
// recebido pelo multer e consulta o repositório para listagem/download.

const { randomUUID } = require('node:crypto');
const documentRepository = require('../repositories/documentRepository');

function toPublicDocument(document) {
  const { storedName, ...publicDocument } = document;
  return publicDocument;
}

function createDocument({ file, owner }) {
  const document = {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    storedName: file.filename,
  };

  return toPublicDocument(documentRepository.create(document));
}

function listDocuments() {
  return documentRepository.findAll().map(toPublicDocument);
}

function getDocumentById(id) {
  return documentRepository.findById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById,
};
