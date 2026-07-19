import React from 'react';
import './FileList.css';

const FileList = ({ files, onViewFile, onDeleteFile, onDownloadFile }) => {
  return (
    <div className="file-list-container">
      <h2>Files ({files.length})</h2>

      {files.length === 0 ? (
        <p className="no-files">No files yet. Create your first file!</p>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file.name} className="file-item">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              <div className="file-actions">
                <button
                  className="btn btn-view"
                  onClick={() => onViewFile(file.name)}
                  title="Open raw view"
                >
                  👁️ View
                </button>
                <button
                  className="btn btn-download"
                  onClick={() => onDownloadFile(file.name)}
                  title="Download file"
                >
                  ⬇️ Download
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDeleteFile(file.name)}
                  title="Delete file"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
