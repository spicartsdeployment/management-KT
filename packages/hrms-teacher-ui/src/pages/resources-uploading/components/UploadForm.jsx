import React, { useState } from 'react';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  return (
    <div className="ru-card" data-testid="teacher-resources-upload-form">
      <h3 className="ru-card-title">Upload New Resource</h3>
      <form onSubmit={handleSubmit} className="ru-form">
        <div className="ru-upload-area">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="ru-file-input"
            data-testid="teacher-resources-file-input"
          />
          <div className="ru-upload-placeholder">
            📤 Drag and drop or click to upload
          </div>
        </div>
        {file && (
          <div className="ru-file-preview">
            Selected: {file.name}
          </div>
        )}
        <button
          type="submit"
          className="ru-btn-primary"
          disabled={!file}
          data-testid="teacher-resources-upload-btn"
        >
          Upload Resource
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
