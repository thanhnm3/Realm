// src/SpotifyPlayer.js
import React, { useEffect, useState } from "react";
import spotifyApi from "./Auth";
import { MdDevices } from "react-icons/md";

const SpotifyPlayer = ({ token }) => {
  //======================= Spotify Player ==============================
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
        getAvailableDevices();
        transferPlaybackToDevice(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, [token]);

  //======================= Get Available Devices ==============================
  const [devices, setDevices] = useState([]);

  const getAvailableDevices = async () => {
    try {
      const result = await spotifyApi.getMyDevices();
      setDevices(result.devices);
      console.log(result);
    } catch (error) {
      console.error("Error occurred while fetching devices:", error);
    }
  };

  const transferPlaybackToDevice = async (deviceId) => {
    try {
      await spotifyApi.transferMyPlayback([deviceId], { play: true });
    } catch (error) {
      console.error("Error occurred while transferring playback:", error);
    }
  };

  return (
    <div>
      {devices.slice(0, 2).map((device) => (
        <div
          key={device.id}
          onClick={() => {
            transferPlaybackToDevice(device.id);
          }}
        >
          <MdDevices />
          {device.name.length > 5
            ? device.name.substring(0, 5) + "..."
            : device.name}
        </div>
      ))}
    </div>
  );
};

export default SpotifyPlayer;
