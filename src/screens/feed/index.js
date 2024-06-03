import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import spotifyApi from "../../Auth";
import "./feed.css";
import { useNavigate } from "react-router-dom";

import { AiFillClockCircle } from "react-icons/ai";

const Feed = () => {
  //======================= Search Functionality ========================

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [onSearch, setOnSearch] = useState(false);

  const msToTime = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  };

  const handleSearch = async () => {
    if (!query) return;
    setOnSearch(true);
    try {
      const result = await spotifyApi.searchTracks(query);
      setSearchResults(result.tracks.items);
    } catch (error) {
      console.error("Error occurred while searching tracks:", error);
    }
  };

  //======================= New Songs ==============================

  const [newReleases, setNewReleases] = useState([]);

  const getNewReleases = async () => {
    try {
      const result = await spotifyApi.getNewReleases({ limit: 10 });
      setNewReleases(result.albums.items);
      console.log(result);
    } catch (error) {
      console.error("Error occurred while fetching new releases:", error);
    }
  };

  useEffect(() => {
    getNewReleases();
  }, []);

  //======================= Get recommend for you ==============================

  const [topTracks, setTopTracks] = useState([]);

  const getTopTracks = async () => {
    try {
      const result = await spotifyApi.getMyTopTracks({ limit: 10 });
      setTopTracks(result.items);
    } catch (error) {
      console.error("Error occurred while fetching top tracks:", error);
    }
  };
  useEffect(() => {
    getTopTracks();
  }, []);

  //======================= Play track and jump to /player ==========================================

  const navigate = useNavigate();
  const playTrack = (trackid) => {
    navigate("/player", { state: { trackId: trackid } });
  };

  return (
    <div className="screen-container flex">
      <div className="music-search-container">
        <input
          type="text"
          placeholder="Search for music ..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <div className="search-button" onClick={handleSearch}>
          <p>Search</p>
          <FaSearch />
        </div>
      </div>

      {onSearch ? (
        <div className="feed-search-body">
          <div className="header-song-row">
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
          </div>
          <div className="search-music-result">
            {searchResults.map((track, index) => (
              <div
                key={index}
                className="track-container"
                onClick={() => {
                  playTrack(track.id);
                  console.log("This is search  ", track.id);
                }}
              >
                <div className="track-name">
                  <img src={track.album.images[0].url} alt="album-cover" />
                  <p>{track.name}</p>
                </div>

                <p className="track-artist">{track.artists[0].name}</p>
                <p className="track-album">{track.album.name}</p>
                <p className="track-duration">{msToTime(track.duration_ms)} </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="recommend-container">
          <p className="recommend-tittle">New Releases</p>
          <div className="recommend-box">
            {newReleases.map((track, index) => (
              <div
                key={index}
                className="recommend-track-container"
                onClick={() => {
                  // playTrack(track.id);
                  console.log("This is new release", track);
                }}
              >
                <div className="recommend-track-cover">
                  <img src={track.images[0].url} alt="recommend-track-cover" />
                </div>
                <div className="recommend-track-info">
                  <p>Song: {track.name}</p>
                  <p className="recommend-track-artist">
                    Artists:
                    {track.artists[0].name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="recommend-tittle">Recommend for you</p>
          <div className="recommend-box">
            {topTracks?.map((track, index) => (
              <div
                key={index}
                className="recommend-track-container"
                onClick={() => {
                  console.log("THis is track id for recommend", track.id);
                  playTrack(track.id);
                }}
              >
                <div className="recommend-track-cover">
                  <img
                    src={track?.album.images?.[0]?.url}
                    alt="recommend-track-cover"
                  />
                </div>
                <div className="recommend-track-info">
                  <p>Song: {track?.name}</p>
                  <p className="recommend-track-artist">
                    Artists:{track?.artists?.[0]?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
