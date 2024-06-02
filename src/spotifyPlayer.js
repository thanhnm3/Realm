// src/SpotifyPlayer.js
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const SpotifyPlayer = ({ token }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Realm Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, [token]);

  const handlePlay = () => {
    if (player) {
      player.togglePlay();
    } else {
      console.log("Player is not ready");
    }
  };

  return (
    <div>
      <button onClick={handlePlay}>Play/Pause</button>
    </div>
  );
};

export default SpotifyPlayer;
