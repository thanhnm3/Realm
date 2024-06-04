import React, { useState, useEffect } from "react";
import "./audioPlayer.css";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";
import Controls from "./controls";
import spotifyApi from "../../Auth";

export default function AudioPlayer({
  currentTrack,
  currentTrackIndex,
  setCurrentTrackIndex,
  total,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackProgress, setTrackProgress] = useState(0);

  const getTrackProgress = async () => {
    try {
      const result = await spotifyApi.getMyCurrentPlaybackState();
      setTrackProgress(result.progress_ms);
    } catch (error) {
      console.error("Error occurred while fetching track progress:", error);
    }
  };

  //======================= Auto get the real time play track ========================//
  useEffect(() => {
    const interval = setInterval(() => {
      getTrackProgress();
    }, 1000); // Update every second

    // Clear interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);
  const currentPercentage = currentTrack?.duration_ms
    ? (trackProgress / currentTrack?.duration_ms) * 100
    : 0;

  useEffect(() => {
    const setPlayStatus = async () => {
      try {
        if (isPlaying) {
          await spotifyApi.play();
        } else {
          await spotifyApi.pause();
        }
      } catch (error) {
        console.error("Error occurred while setting play status:", error);
      }
    };

    setPlayStatus();
  }, [isPlaying]);

  /* 
  var audioSrc = total[currentTrackIndex]?.track.preview_url;

  const audioRef = useRef(new Audio(total[0]?.track.preview_url));

  const intervalRef = useRef();

  const isReady = useRef(false);

  const { duration } = audioRef.current;



  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  useEffect(() => {
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            startTimer();
          })
          .catch((error) => console.log(1, error));
      } else {
        clearInterval(intervalRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    } else {
      if (isPlaying) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current
          .play()
          .then(() => {
            startTimer();
          })
          .catch((error) => console.log(1, error));
      } else {
        clearInterval(intervalRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(audioSrc);

    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          startTimer();
        })
        .catch((error) => console.log(2, error));
    } else {
      isReady.current = true;
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []); */

  //=============================== handle Next and Previous track ==============================//
  const handleNext = async () => {
    let nextTrackIndex =
      currentTrackIndex >= total.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(nextTrackIndex);
    let nextTrack = total[nextTrackIndex];
    console.log("This is next track ", nextTrack);
    await spotifyApi.play({ uris: [nextTrack.track.uri] });
    setIsPlaying(true);
  };

  const handlePrev = async () => {
    let prevTrackIndex =
      currentTrackIndex - 1 < 0 ? total.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevTrackIndex);
    let prevTrack = total[prevTrackIndex];
    await spotifyApi.play({ uris: [prevTrack.track.uri] });
  };

  //=============================== Play track when current track index changes ==============================//
  useEffect(() => {
    const playTrack = async () => {
      try {
        let track = total[currentTrackIndex];
        await spotifyApi.play({ uris: [track.track.uri] });
      } catch (error) {
        console.error("Error occurred while playing track:", error);
      }
    };

    playTrack();
    setIsPlaying(true);
  }, [currentTrackIndex]);

  //===================== Get artist names ================================//

  const artistNames = currentTrack?.album?.artists
    .map((artist) => artist.name)
    .join(" | ");

  function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }
  return (
    <div className="player-body">
      <div className="player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          isPlaying={true}
          image={currentTrack?.album?.images[0]?.url}
          size={300}
          color="#1db954"
        />
      </div>

      <div className="player-right-body">
        <p className="song-title">{currentTrack?.name}</p>
        <p className="song-artist">{artistNames}</p>
        <div className="player-right-bottom">
          <div className="song-duration">
            <p className="duration">{msToTime(trackProgress)}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration"> {msToTime(currentTrack?.duration_ms)}</p>
          </div>
        </div>
        <Controls
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </div>
    </div>
  );
}
