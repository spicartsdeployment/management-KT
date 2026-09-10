import { useState, useEffect } from 'react';

const useResourcesUploading = () => {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([
    { id: 1, name: 'Chapter 5 Notes.pdf', type: 'PDF', size: '2.5 MB', date: '2024-12-10' },
    { id: 2, name: 'Lab Experiment Video.mp4', type: 'Video', size: '45 MB', date: '2024-12-09' },
  ]);

  const handleUpload = (file) => {
    setLoading(true);
    setTimeout(() => {
      const newResource = {
        id: resources.length + 1,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0],
      };
      setResources([newResource, ...resources]);
      setLoading(false);
    }, 1000);
  };

  return { resources, handleUpload, loading };
};

export default useResourcesUploading;
