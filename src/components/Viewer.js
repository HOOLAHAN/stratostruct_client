import { useEffect, useRef } from 'react';

const Viewer = ({ access_token, urn }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewerInstance = null;

    console.log('Effect triggered, attempting to load viewer');

    if(!access_token) {
      console.log('Access token is null or undefined');
      return;
    }

    if(!urn) {
      console.log('URN is null or undefined');
      return;
    }

    const loadViewer = async () => {
      const Autodesk = window.Autodesk;
      if (!Autodesk) {
        console.log('Autodesk object not found in window');
        return;
      }

      console.log('Autodesk object found');

      const options = {
        env: 'AutodeskProduction',
        getAccessToken: (onSuccess) => {
          console.log('Providing access token to Autodesk...');
          onSuccess(access_token, 3600); // 3600 seconds = 1 hour token validity
          console.log(`access token is ${access_token}`)
        },
      };

      Autodesk.Viewing.Initializer(options, () => {
        console.log('Autodesk Viewer initialized');
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current);
        if (!viewer) {
          console.log('Viewer instance could not be created');
          return;
        }
        
        viewer.start();
        console.log('Viewer started');

        const documentId = 'urn:' + urn;
        console.log(`Attempting to load document with ID: ${documentId}`);

        Autodesk.Viewing.Document.load(documentId, (doc) => {
          console.log('Document loaded successfully');
          const defaultModel = doc.getRoot().getDefaultGeometry();
          viewer.loadDocumentNode(doc, defaultModel);
        },
        (errorCode, errorMessage, statusCode) => {
          console.error('Error loading document: ', errorCode, errorMessage, statusCode);
        });

        viewerInstance = viewer;
      });
    };

    loadViewer();

    return () => {
      const Autodesk = window.Autodesk;
      if (!Autodesk) {
        console.log('Autodesk object not found in window');
        return;
      }

      console.log('Shutting down viewer');
      Autodesk.Viewing.shutdown(viewerInstance);
    };
  }, [access_token, urn]);

  return <div ref={viewerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Viewer;
