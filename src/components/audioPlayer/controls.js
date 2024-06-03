import React, { useEffect } from "react";
import "./controls.css";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { IconContext } from "react-icons";
import spotifyApi from "../../Auth";

export default function Controls({
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrev,
}) {
  //======================= Function handle play track ==========================================

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the key is the 'Space' key
      if (event.code === "Space") {
        handlePlayPause();
      }
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  //================================================================================================
  return (
    <IconContext.Provider value={{ size: "30px", color: "#3498db" }}>
      <div className="controls-wrapper">
        <div className="action-btn" onClick={handlePrev}>
          <FaStepBackward className="action-btn" />
        </div>
        <div className="action-btn" onClick={handlePlayPause}>
          {isPlaying ? (
            <FaPause className="action-btn" />
          ) : (
            <FaPlay className="action-btn" />
          )}
        </div>
        <div className="action-btn" onClick={handleNext}>
          <FaStepForward className="action-btn" />
        </div>
      </div>
    </IconContext.Provider>
  );
}
