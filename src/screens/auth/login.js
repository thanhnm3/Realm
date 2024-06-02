import React from "react";
import "./login.css";
import { loginEndpoint } from "../../spotify";

export default function Login() {
  return (
    <div className="login-page">
      <img
        src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/441542787_1862319787569835_1904587085372753703_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C5BWwXFLTxMQ7kNvgGkS3fo&_nc_ht=scontent.fhan14-3.fna&oh=00_AYDS5vN0jOtgwZB-lYV10V929PXO-NPB6vb_T1tT-T3Pag&oe=66521B4B"
        alt="Realm logo"
        className="logo"
      />
      <a href={loginEndpoint}>
        <div className="login-btn">LOGIN</div>
      </a>
    </div>
  );
}
