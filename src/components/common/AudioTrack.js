import React, { useRef } from "react";

function AudioTrack({ sound, audioExt, index, name }) {
  const audioRef = useRef(null);
  const divRef = useRef(null);

  const handlePlay = () => {
    audioRef.current.play();
    if (divRef.current) {
      divRef.current.classList.add("playing");
    }
  };

  const handlePause = () => {
    audioRef.current.pause();
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    if (divRef.current) {
      divRef.current.classList.remove("playing");
    }
  };

  let url = `/audio/${sound}${audioExt}`;

  return (
    <div className="track">
      <audio ref={audioRef} src={url}></audio>
      <div className="track-info">
        <div ref={divRef} className="track-number">
          {index + 1}
        </div>
      </div>

      <div className="audio-controls">
        <div id="playback-buttons">
          <button onClick={handlePlay} title="play">
            <i className="fa fa-play"></i>
          </button>
          <button onClick={handlePause} title="pause">
            <i className="fa fa-pause"></i>
          </button>
          <button onClick={handleStop} title="stop">
            <i className="fa fa-stop"></i>
          </button>
        </div>
        <h5>{name}</h5>
      </div>
    </div>
  );
}

export default AudioTrack;
