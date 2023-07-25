import React from 'react';
import Viewer from '../components/Viewer';
// import { useAuthContext } from "../hooks/useAuthContext";
import IFCFileUpload from '../components/IFCFileUpload';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ViewerPage = () => {
  // const { user } = useAuthContext();
  const [access_token, setAccessToken] = useState(null);
  const [urn, setUrn] = useState(null); // New state for URN
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch access token from backend
    axios.get('/api/viewer/autodesk-auth')
      .then(response => {
        setAccessToken(response.data.access_token);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>3D Model Viewer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : access_token ? (
        <>
          <IFCFileUpload accessToken={access_token} setUrn={setUrn} />
          <Viewer access_token={access_token} urn={urn} />
        </>
      ) : (
        <p>Failed to load. Please try again later.</p>
      )}
    </div>
  );
};


export default ViewerPage;

