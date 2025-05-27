import React, { useState } from "react";

const UploadArea = ({
  image,
  dragActive,
  handleDrag,
  handleDrop,
  handleImageUpload,
  handleReset,
  handleAnalyze,
  isLoading,
}) => {
  const [error, setError] = useState(null);

  const validateFileType = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return false;
    }
    setError(null);
    return true;
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop(e);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFileType(file)) {
        handleImageUpload({ target: { files: [file] } });
      }
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFileType(file)) {
      handleImageUpload(e);
    }
  };

  return (
    <div className="studio-stage upload-stage">
      <div className="stage-header">
        <p>Think you're done? Let’s see what our Critic says.</p>
      </div>

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${image ? 'has-image' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={onDrop}
      >
        {image ? (
          <div className="uploaded-preview">
            <img src={image} alt="Uploaded artwork" />
            <button className="change-image-btn" onClick={handleReset}>
              <span className="btn-icon">↺</span>
              Change Image
            </button>
          </div>
        ) : (
          <>
            <h3 className="upload-title">Drag & Drop Your Artwork</h3>
            <p className="upload-subtitle">or</p>
            <label className="file-input-label">
              <span>Choose File</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                className="file-input"
                disabled={isLoading}
              />
            </label>
            <p className="upload-help">Supports JPG, PNG, WEBP</p>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

      {image && (
        <div className="action-controls">
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            <span className="btn-text">{isLoading ? 'Analyzing...' : 'Analyze Artwork'}</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      )}

      <div className="spacer" style={{ height: "20vh" }} />
    </div>
  );
};

export default UploadArea;