import React, { useEffect, useState } from "react";
import "./player.css";
import { useLocation } from "react-router-dom";
import APIKit from "../../spotify";
import SongCard from "../../components/songCard";
import Queue from "../../components/queue";
import AudioPlayer from "../../components/audioPlayer";
import spotifyApi from "../../Auth";

const Player = () => {
  const location = useLocation();

  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  //===================== Get playlist tracks data ================================
  useEffect(() => {
    if (location.state && location.state.playlistId) {
      APIKit.get(`/playlists/${location.state.playlistId}/tracks`).then(
        (response) => {
          setTracks(response.data.items);
          setCurrentTrack(response.data.items[0].track);
        }
      );
    }
  }, [location.state?.playlistId]);

  useEffect(() => {
    if (tracks[currentTrackIndex]) {
      setCurrentTrack(tracks[currentTrackIndex].track);
    }
  }, [currentTrackIndex, tracks]);

  //===================== Get track data ==========================================
  useEffect(() => {
    if (location.state && location.state.trackId) {
      APIKit.get(`/tracks/${location.state.trackId}`).then((response) => {
        setCurrentTrack(response.data);
      });

      spotifyApi
        .play({ uris: [`spotify:track:${location.state.trackId}`] })
        .then(() => {
          console.log("Track is playing");
        })
        .catch((error) => {
          console.error("Failed to play track:", error);
        });

      spotifyApi.getMyCurrentPlayingTrack().then((response) => {
        console.log(response);
      });
    }
  }, [location.state?.trackId]);

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
        />
      </div>
      <div className="right-player-body">
        <SongCard album={currentTrack?.album} />
      </div>
      <div className="bottom-player-body">
        <Queue tracks={tracks} setCurrentTrackIndex={setCurrentTrackIndex} />
      </div>
    </div>
  );
};

export default Player;
