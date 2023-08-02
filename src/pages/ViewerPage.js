import React, { useState, useEffect } from 'react';
import Viewer from '../components/Viewer';
import { useAuthContext } from "../hooks/useAuthContext";
import IFCFileUpload from '../components/IFCFileUpload';
import axios from 'axios';
import { Buffer } from 'buffer'

const ViewerPage = () => {
  const { user } = useAuthContext();
  const [access_token, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urn, setUrn] = useState(Buffer.from('adsk.objects:os.object:stratostruct/Project1.ifc').toString('base64'));
  console.log(`urn is: ${urn}`)
  const bucketKey = 'stratostruct'

  useEffect(() => {
    if (user && user.token) {
      console.log('User is authenticated, fetching token...');
      setLoading(true);
      axios.get('/api/autodesk/forge-access-token', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then(response => {
          console.log('Successfully fetched token:', response.data.data);
          setAccessToken(response.data.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch token:', error);
          console.error(error);
          setLoading(false);
        });
    } else {
      console.log('User is not authenticated.');
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view this page.</p>
  }

  return (
    <div>
      <h1>3D Model Viewer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : access_token ? (
        <>
          <IFCFileUpload token={user.token} bucketKey={bucketKey} accessToken={access_token} setUrn={setUrn} />
          <Viewer token={user.token} access_token={access_token} urn={urn} />
        </>
      ) : (
        <p>Failed to load. Please try again later.</p>
      )}
    </div>
  );
};


export default ViewerPage;
