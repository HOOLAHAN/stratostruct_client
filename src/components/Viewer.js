import { useEffect, useRef } from 'react';

const Viewer = ({ access_token, urn }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewerInstance = null; // Create a variable to store the viewer instance

    const loadViewer = async () => {
      const Autodesk = window.Autodesk;
      if (!Autodesk) return; // Check if Autodesk is loaded

      const options = {
        env: 'AutodeskProduction',
        getAccessToken: () => access_token, // Function to provide access token
      };

      Autodesk.Viewing.Initializer(options, () => {
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current);
        viewer.start();

        // Load the 3D model using the provided URN
        const documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, (doc) => {
          const defaultModel = doc.getRoot().getDefaultGeometry();
          viewer.loadDocumentNode(doc, defaultModel);
        });

        // Store the viewer instance in the variable
        viewerInstance = viewer;
      });
    };

    loadViewer();

    // Clean up the viewer when the component unmounts
    return () => {
      const Autodesk = window.Autodesk;
      if (!Autodesk) return;

      // Use the stored viewer instance variable in the cleanup function
      Autodesk.Viewing.shutdown(viewerInstance);
    };
  }, [access_token, urn]);

  return <div ref={viewerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Viewer;

