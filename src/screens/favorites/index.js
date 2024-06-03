import React, { useState, useEffect } from "react";
import "./favorites.css";
import spotifyApi from "../../Auth";

import { useNavigate } from "react-router-dom";

import { AiFillClockCircle } from "react-icons/ai";
import { FaHeartCircleXmark } from "react-icons/fa6";
import { GiHearts } from "react-icons/gi";
import { FaMusic } from "react-icons/fa";

const Favorites = () => {
  //===================== Get favorite songs data ====================================
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    spotifyApi
      .getMySavedTracks()
      .then((response) => {
        setTracks(response.items);
        console.log("Tracks", response.items);
      })
      .catch((error) => {
        console.error("Error getting Tracks:", error);
      });
  }, []);

  //=========================== Play favorite track ===================================

  const navigate = useNavigate();
  const playTrack = (trackid) => {
    navigate("/player", { state: { trackId: trackid } });
    console.log("Track", trackid);
  };

  return (
    <div className="screen-container">
      <div className="tittle">
        <p>My favorite songs</p>

        <FaMusic />
      </div>
      <div className="list">
        <div className="header-row">
          <div className="col">
            <span>STT</span>
          </div>
          <div className="col">
            <span>SONG NAME</span>
          </div>
          <div className="col">
            <span>ARTISTS</span>
          </div>
          <div className="col">
            <span>ALBUM</span>
          </div>
          <div className="col icon ">
            <AiFillClockCircle />
          </div>
          <div className="col icon">
            <GiHearts />
          </div>
        </div>
        <div className="tracks">
          {tracks &&
            tracks.map((track, index) => {
              const duration_ms = track.track.duration_ms;
              const image = track.track.album?.images[0]?.url;
              const artist = track.track.album.artists
                .map((artist) => artist.name)
                .join(", ");
              return (
                <div
                  className="row"
                  key={index}
                  onClick={() => {
                    playTrack(track.track.id);
                  }}
                >
                  <div className="col">
                    <span>{index + 1}</span>
                  </div>
                  <div className="col detail">
                    <img src={image} alt="track" className="image" />
                    <div className="info">
                      <span className="name">{track.track.name}</span>
                    </div>
                  </div>

                  <div className="col info ">
                    <span>{artist}</span>
                  </div>

                  <div className="col">
                    <span>{track.track.album.name}</span>
                  </div>
                  <div className="col">
                    <span>
                      {Math.floor(duration_ms / 60000)}:
                      {((duration_ms % 60000) / 1000).toFixed(0)}
                    </span>
                  </div>
                  <div className="col icon">
                    <FaHeartCircleXmark />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
