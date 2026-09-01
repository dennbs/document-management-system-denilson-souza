// Controller de documentos: trata entrada/saída HTTP e validação básica,
// delegando as regras de negócio para o service.

const path = require('node:path');
const fs = require('node:fs');
const documentService = require('../services/documentService');

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo foi enviado.' });
  }

  const owner = req.body.owner?.trim();
  if (!owner) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ erro: 'O proprietário é obrigatório.' });
  }

  const document = documentService.createDocument({ file: req.file, owner });

  return res.status(201).json(document);
}

function listDocuments(req, res) {
  const documents = documentService.listDocuments();
  return res.json(documents);
}

function downloadDocument(req, res) {
  const { id } = req.params;
  const document = documentService.getDocumentById(id);

  if (!document) {
    return res.status(404).json({ erro: 'Documento não encontrado.' });
  }

  const storageDir = process.env.STORAGE_DIR || path.join(__dirname, '..', '..', 'storage');
  const filePath = path.join(storageDir, document.storedName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ erro: 'Arquivo não encontrado no armazenamento.' });
  }

  return res.download(filePath, document.originalName);
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
