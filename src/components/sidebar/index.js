import React, { useEffect, useState } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";

// This is import icon from react-icons
import { MdDashboard } from "react-icons/md";
import { BsMusicPlayer } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { IoLibraryOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MdOndemandVideo } from "react-icons/md";
import apiClient from "../../spotify";
import SpotifyWebApi from "spotify-web-api-js";

export default function Sidebar() {
  // This is the initialize function to access the token from localStorage and set it to the spotifyApi
  const initialize = () => {
    const spotifyApi = new SpotifyWebApi();
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
    }
  };

  initialize();

  //=======================================================================================================

  const [image, setImage] = useState(
    "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/441509436_1862319750903172_8224211991501724738_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7b3PsIfudxAQ7kNvgGgT8k_&_nc_ht=scontent.fhan14-3.fna&oh=00_AYDsj2eBfirYs8UJXjUFfAH_uQ6TCwzrEoU60HWTwmMc5A&oe=665201AF"
  );

  const logout = () => {
    window.location.reload();
  };

  useEffect(() => {
    apiClient.get("/me").then((response) => {
      setImage(response.data.images[0].url);
    });
  }, []);

  const token = window.localStorage.getItem("token");

  return (
    <div className="sidebar-container">
      <img src={image} className="profile-img" alt="profile" />
      <div>
        <SidebarButton title="Feed" to="/feed" icon={<MdDashboard />} />
        <SidebarButton
          title="Music Video"
          to="/video"
          icon={<MdOndemandVideo />}
        />
        <SidebarButton title="Player" to="/player" icon={<BsMusicPlayer />} />
        <SidebarButton
          title="Favorites"
          to="/favorites"
          icon={<MdFavoriteBorder />}
        />
        <SidebarButton title="Library" to="/" icon={<IoLibraryOutline />} />
      </div>

      <SidebarButton
        title="Sign out"
        to=""
        icon={<FiLogOut onClick={logout} />}
      />
    </div>
  );
}
