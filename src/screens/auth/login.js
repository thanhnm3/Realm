import React from "react";
import "./login.css";
import { loginEndpoint } from "../../spotify";
import logo from "../../shared/Logo512.png";

export default function Login() {
  return (
    <div className="login-page">
      <img src={logo} alt="Realm logo" className="logo" />
      <a href={loginEndpoint}>
        <div className="login-btn">LOGIN</div>
      </a>
    </div>
  );
}
