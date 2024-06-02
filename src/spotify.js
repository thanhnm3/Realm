import axios from "axios";

// ================== Get token from URL ==================

const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = "f6a3c806bef746eb92a60ce43fc9356f";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-library-read",
  "user-top-read",
  "playlist-read-private",
  "streaming",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

export const loginEndpoint = `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

// =======================================================

const APIKit = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

export const setClientToken = function (token) {
  APIKit.interceptors.request.use(async function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default APIKit;
