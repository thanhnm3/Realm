import React from "react";
import "./queue.css";

import { MdLibraryMusic } from "react-icons/md";

export default function Queue({ tracks, setCurrentTrackIndex }) {
  console.log(tracks);

  function formatDuration(duration_ms) {
    let minutes = Math.floor(duration_ms / 60000);
    let seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <div className="queue-container">
      <div className="queue">
        <div className="upNext">
          <MdLibraryMusic />
          <p>Up Next :</p>
        </div>
        <div className="queue-list">
          {tracks?.map((track, index) => (
            <div
              className="queue-items"
              onClick={() => setCurrentTrackIndex(index)}
            >
              <p className="track-name">{track.track.name}</p>
              <p>{formatDuration(track.track.duration_ms)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
