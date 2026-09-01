// Rotas de documentos: define os endpoints e delega para os controllers.
// O upload utiliza multer com diskStorage, gravando os arquivos em
// backend/storage (restrição de armazenamento local do projeto).

const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();

const storageDir = process.env.STORAGE_DIR || path.join(__dirname, '..', '..', 'storage');

fs.mkdirSync(storageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
