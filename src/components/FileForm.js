import React, { useState } from 'react';
import './FileForm.css';

const FileForm = ({ onCreateFile }) => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateFile(fileName, fileContent);
      setFileName('');
      setFileContent('');
    } catch (error) {
      console.error('Error creating file:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <form className="file-form" onSubmit={handleSubmit}>
      <h2>Create New File</h2>

      <div className="form-group">
        <label htmlFor="fileName">Enter new file name:</label>
        <input
          id="fileName"
          type="text"
          placeholder="e.g., myfile.txt"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="fileContent">Enter file contents here:</label>
        <textarea
          id="fileContent"
          placeholder="Paste your file content here..."
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          rows="15"
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Creating...' : 'Create File'}
      </button>
    </form>
  );
};

export default FileForm;
