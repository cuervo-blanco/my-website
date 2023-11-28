import React from "react";
import AudioTrack from "./AudioTrack";

function AudioPlayer(props) {
  const { poster, tracks, ext, title = [] } = props;

  const audioExt = ext;

  const posterUrl = `/img/${poster}`;


  return (
    <div id="audio-container">
      <div id="movie-poster">
        <img src={posterUrl} alt={title} />
      </div>

      <div id="audio-player">
        <div className="track-list">
          <h2>{title}</h2>
          <hr></hr>
          {Array.isArray(tracks) &&
            tracks.map((trackName, i) => (
              <AudioTrack
                key={i}
                sound={trackName[0]}
                audioExt={audioExt}
                index={i}
                name={trackName[1]}
              />
            ))}
          <hr></hr>
        </div>
      </div>
    </div>
  );
}
export default AudioPlayer;
