import { useEffect, useRef } from 'react';

const Viewer = ({ access_token, urn }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewerInstance = null;

    const loadViewer = async () => {
      const Autodesk = window.Autodesk;
      if (!Autodesk) return;

      const options = {
        env: 'AutodeskProduction',
        getAccessToken: (onSuccess) => {
          console.log('Providing access token to Autodesk...')
          onSuccess(access_token, 3600); // 3600 seconds = 1 hour token validity
        },
      };

      Autodesk.Viewing.Initializer(options, () => {
        console.log('Autodesk Viewer initialized')
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current);
        viewer.start();

        const documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, (doc) => {
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
      if (!Autodesk) return;

      Autodesk.Viewing.shutdown(viewerInstance);
    };
  }, [access_token, urn]);

  return <div ref={viewerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Viewer;
