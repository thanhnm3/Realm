import React, { useState, useRef, useEffect } from "react";
import "./audioPlayer.css";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";
import Controls from "./controls";

export default function AudioPlayer({
  currentTrack,
  currentTrackIndex,
  setCurrentTrackIndex,
  total,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackProgress, setTrackProgress] = useState(0);
  var audioSrc = total[currentTrackIndex]?.track.preview_url;

  const audioRef = useRef(new Audio(total[0]?.track.preview_url));

  const intervalRef = useRef();

  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

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
  }, []);

  const handleNext = () => {
    if (currentTrackIndex >= total.length - 1) {
      setCurrentTrackIndex(0);
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex - 1 < 0) {
      setCurrentTrackIndex(total.length - 1);
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const addZeros = (num) => {
    return num > 9 ? "" + num : "0" + num;
  };

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
            <p className="duration">0:{addZeros(Math.round(trackProgress))}</p>
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
