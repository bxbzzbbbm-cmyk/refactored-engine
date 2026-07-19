import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileManager.css';
import FileForm from './FileForm';
import FileList from './FileList';
import FileViewer from './FileViewer';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'view'

  const API_URL = 'http://localhost:5000';

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/files`);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch files');
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreateFile = async (fileName, content) => {
    try {
      await axios.post(`${API_URL}/api/files`, {
        fileName,
        fileContent: content
      });
      setError(null);
      fetchFiles();
      alert('File created successfully!');
    } catch (err) {
      setError('Failed to create file');
      console.error(err);
    }
  };

  const handleViewFile = async (fileName) => {
    try {
      const response = await axios.get(`${API_URL}/api/files/${fileName}`);
      setSelectedFile(fileName);
      setFileContent(response.data.content);
      setViewMode('view');
      setError(null);
    } catch (err) {
      setError('Failed to read file');
      console.error(err);
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/files/${fileName}`);
        setError(null);
        fetchFiles();
        if (selectedFile === fileName) {
          setSelectedFile(null);
          setViewMode('list');
        }
        alert('File deleted successfully!');
      } catch (err) {
        setError('Failed to delete file');
        console.error(err);
      }
    }
  };

  const handleDownloadFile = (fileName) => {
    window.location.href = `${API_URL}/api/files/${fileName}/download`;
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedFile(null);
    setFileContent('');
  };

  return (
    <div className="file-manager-container">
      <header className="file-manager-header">
        <h1>📁 File Manager</h1>
        <p>Create, view, download, and manage your files</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      {viewMode === 'list' ? (
        <div className="file-manager-content">
          <div className="left-panel">
            <FileForm onCreateFile={handleCreateFile} />
          </div>
          <div className="right-panel">
            {loading ? (
              <p className="loading">Loading files...</p>
            ) : (
              <FileList
                files={files}
                onViewFile={handleViewFile}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
              />
            )}
          </div>
        </div>
      ) : (
        <FileViewer
          fileName={selectedFile}
          content={fileContent}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default FileManager;
