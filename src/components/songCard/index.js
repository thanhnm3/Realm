import React from "react";
import "./songCard.css";
import AlbumImg from "./albumImg.js";
import AlbumInfo from "./albumInfo.js";

export default function SongCard({ album }) {
  return (
    <div className="songCard-body">
      <AlbumImg url={album?.images[0]?.url} />
      <AlbumInfo album={album} />
    </div>
  );
}
