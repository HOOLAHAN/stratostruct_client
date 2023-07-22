import React from 'react';
import Viewer from '../components/Viewer';
import { useAuthContext } from "../hooks/useAuthContext";
import IFCFileUpload from '../components/IFCFileUpload';

const ViewerPage = () => {
  // Assuming the 'user' object is obtained from your authentication context
  const { user } = useAuthContext();
  const access_token = user ? user.access_token : null;

  // Replace 'YOUR_3D_MODEL_URN' with the appropriate value
  const urn = 'YOUR_3D_MODEL_URN';

  return (
    <div>
      <h1>3D Model Viewer</h1>
      {access_token ? (
        <>
          <IFCFileUpload accessToken={access_token} />
          <Viewer access_token={access_token} urn={urn} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewerPage;
