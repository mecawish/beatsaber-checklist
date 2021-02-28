import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import { API } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listSongs } from "./graphql/queries";
import {
  createSong as createSongMutation,
  deleteSong as deleteSongMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", composer: "", album: "", level: "" };

function App() {
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const apiData = await API.graphql({ query: listSongs });
    setSongs(apiData.data.listSongs.items);
  }

  async function createSong() {
    if (!formData.name || !formData.composer || !formData.album || !formData.level) return;
    await API.graphql({
      query: createSongMutation,
      variables: { input: formData },
    });
    setSongs([...songs, formData]);
    setFormData(initialFormState);
  }

  async function deleteSong({ id }) {
    const newNotesArray = songs.filter((note) => note.id !== id);
    setSongs(newNotesArray);
    await API.graphql({
      query: deleteSongMutation,
      variables: { input: { id } },
    });
  }

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
        <h1>Beat Saber Songs</h1>
        <input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          value={formData.name}
        />
        <input
          onChange={(e) =>
            setFormData({ ...formData, composer: e.target.value })
          }
          placeholder="Composer"
          value={formData.composer}
        />
        <input
          onChange={(e) => setFormData({ ...formData, album: e.target.value })}
          placeholder="Album"
          value={formData.album}
        />
        <input
          onChange={(e) =>
            setFormData({ ...formData, level: e.target.value })
          }
          placeholder="Level"
          value={formData.level}
        />
        <button onClick={createSong}>Add Song</button>
        <div style={{ marginBottom: 30 }}>
          {songs.map((song) => (
            <div key={song.id || song.name}>
              <h2>{song.name}</h2>
              <p>{song.composer}</p>
              <p>{song.album}</p>
              <p>{song.level}</p>
              <button onClick={() => deleteSong(song)}>Delete song</button>
            </div>
          ))}
        </div>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
