const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const FILES_DIR = path.join(__dirname, 'files');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// API Routes

// GET - Fetch all files
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(FILES_DIR);
    const fileData = files.map(file => ({
      name: file,
      path: path.join(FILES_DIR, file),
      size: fs.statSync(path.join(FILES_DIR, file)).size
    }));
    res.json(fileData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// POST - Create new file
app.post('/api/files', (req, res) => {
  const { fileName, fileContent } = req.body;

  if (!fileName || fileContent === undefined) {
    return res.status(400).json({ error: 'File name and content are required' });
  }

  const filePath = path.join(FILES_DIR, fileName);

  try {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    res.status(201).json({ message: 'File created successfully', fileName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// GET - Fetch file by name (raw view)
app.get('/api/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ fileName, content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// PUT - Update file
app.put('/api/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const { fileContent } = req.body;
  const filePath = path.join(FILES_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    fs.writeFileSync(filePath, fileContent, 'utf8');
    res.json({ message: 'File updated successfully', fileName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// DELETE - Delete file
app.delete('/api/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully', fileName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET - Download file
app.get('/api/files/:fileName/download', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
