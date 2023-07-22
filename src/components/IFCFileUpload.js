import React, { useState } from 'react';
import axios from 'axios';

const IFCFileUpload = ({ accessToken }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload-IFC', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { urn } = response.data;
      setUploadStatus(`IFC model uploaded successfully. URN: ${urn}`);
    } catch (error) {
      console.error('Error uploading IFC model:', error.message);
      setUploadStatus('Failed to upload IFC model.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload IFC</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default IFCFileUpload;
