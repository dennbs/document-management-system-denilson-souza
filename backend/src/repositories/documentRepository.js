// Repositório de documentos: mantém os metadados em memória nesta fase.
// A persistência dos arquivos em si é feita pelo multer (diskStorage),
// fora deste repositório.

const documents = [];

function create(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((doc) => doc.id === id);
}

module.exports = {
  create,
  findAll,
  findById,
};
