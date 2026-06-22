const mimeTypes = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

function AudioTrack({ sound, audioExt, assetPath, index, name }) {
  const url = `${assetPath}/${sound}${audioExt}`;

  return (
    <li className="track">
      <div className="track-info">
        <div className="track-number">{index + 1}</div>
      </div>

      <div className="audio-controls">
        <p className="track-name">{name}</p>
        <audio controls preload="none">
          <source src={url} type={mimeTypes[audioExt] || "audio/mpeg"} />
          Your browser does not support HTML audio playback.
        </audio>
      </div>
    </li>
  );
}

export default AudioTrack;
