import React from "react";
import "./albumInfo.css";

export default function AlbumInfo({ album }) {
  console.log(album);
  const artists = album?.artists?.map((artist) => artist.name).join(", ");
  return (
    <div className="albumInfo-card">
      <div className="albumName-container">
        <p>{album?.name} </p>
      </div>
      <div className="album-artist">
        <p>Artists: {artists}</p>
      </div>
      <div className="album-release">
        <p>Release: {album?.release_date}</p>
      </div>
    </div>
  );
}
