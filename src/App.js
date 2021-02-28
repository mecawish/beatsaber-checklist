import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import { API, Storage } from "aws-amplify";
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

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchSongs();
  }

  async function fetchSongs() {
    const apiData = await API.graphql({ query: listSongs });
    const songsFromAPI = apiData.data.listSongs.items;
    await Promise.all(
      songsFromAPI.map(async (song) => {
        if (song.image) {
          const image = await Storage.get(song.image);
          song.image = image;
        }
        return song;
      })
    );
    setSongs(apiData.data.listSongs.items);
  }

  async function createSong() {
    if (
      !formData.name ||
      !formData.composer ||
      !formData.album ||
      !formData.level
    )
      return;
    await API.graphql({
      query: createSongMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
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
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          placeholder="Level"
          value={formData.level}
        />
        <input type="file" onChange={onChange} />
        <button onClick={createSong}>Add Song</button>
        <div style={{ marginBottom: 30 }}>
          {songs.map((song) => (
            <div key={song.id || song.name}>
              <h2>{song.name}</h2>
              <p>{song.composer}</p>
              <p>{song.album}</p>
              <p>{song.level}</p>
              <button onClick={() => deleteSong(song)}>Delete song</button>
              {song.image && (
                <img
                  src={song.image}
                  alt="album_image"
                  style={{ width: 400 }}
                />
              )}
            </div>
          ))}
        </div>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
