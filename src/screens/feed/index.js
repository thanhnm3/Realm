import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import spotifyApi from "../../Auth";
import "./feed.css";
import { useNavigate } from "react-router-dom";

import { AiFillClockCircle } from "react-icons/ai";
import { FaHeartCirclePlus } from "react-icons/fa6";

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

  //======================= Add track to favorite ========================

  const addToFavorites = async (event, trackId) => {
    event.stopPropagation();
    try {
      await spotifyApi.addToMySavedTracks([trackId]);
      console.log("Track was added to favorites successfully.");
    } catch (error) {
      console.error("Error adding track to favorites:", error);
    }
  };

  //======================= New Songs ==============================
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const getPlaylistTracks = async (playlistId) => {
    try {
      const result = await spotifyApi.getPlaylistTracks(playlistId);
      setPlaylistTracks(result.items);
    } catch (error) {
      console.error("Error occurred while fetching playlist tracks:", error);
    }
  };

  useEffect(() => {
    getPlaylistTracks("37i9dQZF1DX0F4i7Q9pshJ");
  }, []);
  console.log("This is playlist tracks hot hits vietnam ", playlistTracks);
  //======================= Get recommend for you ==============================

  const [recommendedTracks, setRecommendedTracks] = useState([]);

  const getRecommendedTracks = async () => {
    try {
      // Get the recently played tracks
      const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 2,
      });

      // Extract the track IDs to use as seeds
      const seedTracks = recentlyPlayed.items.map((item) => item.track.id);

      const result = await spotifyApi.getRecommendations({
        seed_tracks: seedTracks,
        limit: 20,
      });
      setRecommendedTracks(result.tracks);
    } catch (error) {
      console.error("Error occurred while fetching recommended tracks:", error);
    }
  };

  useEffect(() => {
    getRecommendedTracks();
  }, []);

  /*   const [topTracks, setTopTracks] = useState([]);

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
  }, []); */

  //======================= Play track and jump to /player ==========================================

  const navigate = useNavigate();
  const playTrack = (trackid) => {
    navigate("/player", { state: { trackId: trackid } });
    console.log("Track", trackid);
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
            <div className="col icon ">
              <FaHeartCirclePlus />
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
                <div
                  className="col icon "
                  onClick={(event) => addToFavorites(event, track.id)}
                >
                  <FaHeartCirclePlus />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="recommend-container">
          <p className="recommend-tittle">Hot Hits VietNam</p>
          <div className="recommend-box">
            {playlistTracks.map((track, index) => (
              <div
                key={index}
                className="recommend-track-container"
                onClick={() => {
                  playTrack(track.track.id);
                  console.log("This is hot hits vietnam", track.track.id);
                }}
              >
                <div className="recommend-track-cover">
                  <img
                    src={track?.track?.album?.images?.[0]?.url}
                    alt="recommend-track-cover"
                  />
                </div>
                <div className="recommend-track-info">
                  <p>Song: {track?.track?.name}</p>
                  <p className="recommend-track-artist">
                    Artists:
                    {track?.track?.artists?.[0]?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="recommend-tittle">Recommend for you</p>
          <div className="recommend-box">
            {recommendedTracks?.map((track, index) => (
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
