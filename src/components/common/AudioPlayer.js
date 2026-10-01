import AudioTrack from "./AudioTrack";

function AudioPlayer({ poster, tracks, ext, title, assetPath = "/audio" }) {
  const posterUrl = `/img/${poster}`;

  return (
    <article className="audio-container portfolio-audio-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={`${title} poster`} loading="lazy" />
      </div>

      <div className="audio-player">
        <div className="track-list">
          <h3>{title}</h3>
          <ul className="track-items">
            {Array.isArray(tracks) &&
              tracks.map((track, index) => (
                <AudioTrack
                  key={`${title}-${track[0]}`}
                  sound={track[0]}
                  audioExt={ext}
                  assetPath={assetPath}
                  index={index}
                  name={track[1]}
                />
              ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default AudioPlayer;
