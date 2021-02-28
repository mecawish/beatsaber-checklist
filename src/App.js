import React from "react";
import logo from "./logo.png";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>We now have Auth!</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <p>Under construction...</p>
          <a
            className="App-link"
            href="https://beatsaber.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Beat Saber
          </a>
        </div>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
