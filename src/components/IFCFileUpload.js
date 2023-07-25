import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IFCFileUpload = ({ accessToken, setUrn }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [objectId, setObjectId] = useState(null);

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

      const { objectId } = response.data;
      setObjectId(objectId);
      setUploadStatus(`IFC model uploaded successfully. Object ID: ${objectId}`);
    } catch (error) {
      console.error('Error uploading IFC model:', error.message);
      setUploadStatus('Failed to upload IFC model.');
    }
  };

  useEffect(() => {
    if (objectId) {
      // Use Buffer for base64 encoding
      const urn = Buffer.from(objectId).toString('base64')
        .replace('+', '-')
        .replace('/', '_')
        .replace(/=+$/, '');
      setUrn(urn);
    }
  }, [objectId, setUrn]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload IFC</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default IFCFileUpload;
