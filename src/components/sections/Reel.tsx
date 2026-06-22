import { useEffect, useRef, useState, type FC } from "react";
import { getStorageAssetUrl } from "../../lib/firebase";

interface ReelProps {
  storagePath: string;
  width?: number | string;
  height?: number | string;
}

const Reel: FC<ReelProps> = ({
  storagePath,
  width = "100%",
  height = "auto",
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    getStorageAssetUrl(storagePath)
      .then((url) => setVideoUrl(url))
      .catch((err) => setError(err.message));
  }, [shouldLoad, storagePath]);

  return (
    <section id="reel" ref={sectionRef}>
      {error && <div style={{ color: "red" }}>Error loading video: {error}</div>}
      {!error && !videoUrl && <div className="media-placeholder">Loading reel...</div>}
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          width={width}
          height={height}
          style={{ borderRadius: "8px", backgroundColor: "#000" }}
        />
      )}
    </section>
  );
};

export default Reel;
