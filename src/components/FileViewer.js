import React from 'react';
import './FileViewer.css';

const FileViewer = ({ fileName, content, onBack }) => {
  return (
    <div className="file-viewer-container">
      <div className="viewer-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>📄 {fileName}</h2>
      </div>

      <div className="viewer-content">
        <pre className="file-content-display">{content}</pre>
      </div>

      <div className="viewer-actions">
        <button className="action-btn" onClick={() => navigator.clipboard.writeText(content)}>
          📋 Copy to Clipboard
        </button>
        <button className="action-btn" onClick={onBack}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
