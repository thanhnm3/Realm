import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

// Set the access token here if you have it at this point
const accessToken = localStorage.getItem("token");
if (accessToken) {
  spotifyApi.setAccessToken(accessToken);
}

export default spotifyApi;
