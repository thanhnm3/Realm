import React, { useEffect, useState } from "react";
import APIKit from "../../spotify";
import "./library.css";
import "../../shared/globalStyles.css";

import { useNavigate } from "react-router-dom";

import { FaPlayCircle } from "react-icons/fa";

const Library = () => {
  const [playlists, setPlaylists] = useState(null);

  //===================== Get playlists data ====================================
  useEffect(() => {
    APIKit.get("/me/playlists").then(function (response) {
      setPlaylists(response.data.items);
      console.log(response.data.items);
    });
  }, []);

  //===================== Play playlist ==========================================

  const navigate = useNavigate();
  const playPlaylist = (Playlistid) => {
    navigate("/player", { state: { playlistId: Playlistid } });
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {playlists?.map((playlist) => {
          return (
            <div
              className="playlist-card"
              key={playlist.id}
              onClick={() => playPlaylist(playlist.id)}
            >
              <img src={playlist.images?.[0].url} className="playlist-img" />
              <p className="playlist-title">{playlist.name}</p>
              <p className="playlist-subtitle">
                <FaPlayCircle className="play-icon" />
                {playlist.tracks.total} Songs{" "}
              </p>
              <div class="playlist-info">
                <h2 class="playlist-title">{playlist.name}</h2>
                <p class="playlist-description">{playlist.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
