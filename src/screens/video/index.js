import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

import "./video.css";

export default function Video() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");

  //================================== Event click search result ==================================

  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearchResultClick = (video) => {
    // Update the isPlaying state of the clicked video
    const updatedVideos = videos.map((item) => {
      if (item.id === video.id) {
        return { ...item, isPlaying: true };
      } else {
        return { ...item, isPlaying: false };
      }
    });

    // Update the videos state
    setVideos(updatedVideos);

    // Set the isPlaying state to true
    setIsPlaying(true);
  };

  //================================== Search Youtube ==================================
  const handleSearchYoutube = async () => {
    let res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: "AIzaSyDeJYc59LMj5oA7pumYWGXGNyC62-QBLAM",
        maxResults: 20,
        part: "snippet",
        q: query,
        type: "video",
      },
    });
    console.log(res.data.items);

    if (res.data.items) {
      let raw = res.data.items;
      let result = [];
      if (raw && raw.length > 0) {
        raw.map((item) => {
          let object = {};
          object.id = item.id.videoId;
          object.title = item.snippet.title;
          object.createAt = item.snippet.publishedAt;
          object.author = item.snippet.channelTitle;
          object.description = item.snippet.description;

          result.push(object);
        });
      }
      setVideos(result);
    }
  };

  return (
    <div className="screen-container">
      <div className="youtube-search-container">
        <input
          type="text"
          placeholder="Search for music video ..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearchYoutube();
            }
          }}
        />
        <div className="search-button" onClick={handleSearchYoutube}>
          <p>Search</p>
          <FaSearch />
        </div>
      </div>
      <div className="list-search-result">
        {videos &&
          videos.length > 0 &&
          videos.map((item) => {
            return (
              <div
                className={
                  item.isPlaying ? "search-result-big" : "search-result"
                }
                key={item.id}
                onClick={() => handleSearchResultClick(item)}
              >
                <div className="left-body">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${item.id}`}
                    title={item.title}
                    frameborder="0"
                    allow="accelerometer; encrypted-media; picture-in-picture;"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="right-body">
                  <div className="title">{item.title}</div>
                  <div className="created">Create At : {item.createAt}</div>
                  <div className="author">Author : {item.author}</div>
                  <div className="description">
                    Description : {item.description}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
