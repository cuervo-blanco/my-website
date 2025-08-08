import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

interface ReelProps {
  storagePath: string;
  width?: number | string;
  height?: number | string;
}

const Reel: React.FC<ReelProps> = ({ storagePath, width = '100%', height = 'auto' }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, storagePath);

    getDownloadURL(videoRef)
      .then((url) => setVideoUrl(url))
      .catch((err) => setError(err.message));
  }, [storagePath]);

  if (error) {
    return <div style={{ color: 'red' }}>Error loading video: {error}</div>;
  }

  if (!videoUrl) {
    return <div>Loading video...</div>;
  }

  return (
    <video
      src={videoUrl}
      controls
      width={width}
      height={height}
      style={{ borderRadius: '8px', backgroundColor: '#000' }}
    />
  );
};

export default Reel;
