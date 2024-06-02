import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Library from "../library";
import Feed from "../feed";
import Video from "../video";
import Player from "../player";
import Favorites from "../favorites";
import Login from "../auth/login";

import "./home.css";
import Sidebar from "../../components/sidebar";
import { setClientToken } from "../../spotify";

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Xoa local storage moi khi refresh page
    window.onbeforeunload = function () {
      localStorage.clear();
    };

    const token = window.localStorage.getItem("token");
    const hash = window.location.hash;
    window.location.hash = "";
    if (!token && hash) {
      const _token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", _token);
      setToken(_token);
      setClientToken(_token);
    } else {
      setToken(token);
    }
  }, []);

  return !token ? (
    <Login />
  ) : (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/video" element={<Video />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}
