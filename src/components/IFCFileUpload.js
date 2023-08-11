import React, { useState } from 'react';
import axios from 'axios';

const IFCFileUpload = ({ token, bucketKey, setUrn }) => {
  const [file, setFile] = useState();
  const [uploadStatus, setUploadStatus] = useState('');

  const pollTranslationJob = async (urn) => {
    try {
      const response = await axios.get(`/api/autodesk/check-translation-status/${urn}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error polling translation job:', error);
    }
  };

  const handleUpload = async () => {
    setUploadStatus('Uploading file...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`/api/autodesk/uploadIFC/${bucketKey}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      const urn = response.data.urn;
      setUploadStatus('File uploaded. Translating file...');
      
      try {
        const translateResponse = await axios.post('/api/autodesk/translate-file', { urn, fileName: response.data.fileName }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (translateResponse.data.result !== 'created') {
          throw new Error('Failed to start translation job');
        }

        setUploadStatus('Translation started. Polling job...');
        let jobStatus = await pollTranslationJob(urn);
        while (jobStatus.status === 'inprogress') {
          await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds
          jobStatus = await pollTranslationJob(urn);
        }
        if (jobStatus.status === 'failed') {
          console.error('Translation job failed');
          setUploadStatus('Failed to translate IFC model.');
        } else {
          console.log('Translation job complete:', jobStatus);
          setUploadStatus('Translation completed.');
          
          // Retrieve URN from the back-end
          try {
            const urnResponse = await axios.get(`/api/autodesk/getURN/${bucketKey}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            setUrn(urnResponse.data.urn);
          } catch (error) {
            console.error('Failed to retrieve URN:', error);
          }
        }
      } catch (error) {
        console.error('Error starting translation job:', error);
        setUploadStatus('Failed to start translation job.');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default IFCFileUpload;
