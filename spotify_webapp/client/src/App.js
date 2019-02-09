import React, { Component } from 'react';
import './App.css';

/// <reference path="../node_modules/spotify-web-api-js/src/typings/spotify-web-api.d.ts" />

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


function loadJSON(path, success, error)
{
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function()
{
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            if (success)
                success(JSON.parse(xhr.responseText));
        } else {
            if (error)
                error(xhr);
        }
    }
};

  xhr.open("GET", path, true);
  xhr.send();

}


let labelledMood = ""

loadJSON("label.json",
         function(data) {
           labelledMood = data
           console.log("Labelled mood from JSON file: " + data); },
         function(xhr) { console.error(xhr); }
);


class App extends Component {
    constructor(){
      super();
      const params = this.getHashParams();
      const token = params.access_token;
      if (token) {
        spotifyApi.setAccessToken(token);
      }

      this.state = {
        loggedIn: token ? true : false,
        nowPlaying: { name: 'Not Checked', albumArt: '' },
        moodSearch: { name: 'Not Found', albumArt: ''}
      }
    }




  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getMoodPlaylist(label_from_json) {
    // search playlist that contains whichever mood is labelled
    spotifyApi.searchPlaylists(label_from_json + " Mood")
      .then((data) => {
        console.log('Mood searched: ', data);
        this.setState({
          moodSearch: {
            name: data.playlists.items[0].name,
            albumArt: data.playlists.items[0].images[0].url
          }
        })
      })
      .catch((err) => {
        console.error(err);
      })
  }

//create a new function
  render() {
    return(
      <div className="App">
      {/* TODO: this.state.user ? block of code below : buttononClick */}
        <a href='http://localhost:8888' > Login to Spotify </a>
    {/*    <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        */}
        <div>
          Mood search: { this.state.moodSearch.name }
        </div>

        <div>
          <img src={this.state.moodSearch.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getMoodPlaylist(labelledMood)}>
            Get Mood Playlist
          </button>
        }

        <div>
        { /* <iframe src={this.state.nowPlaying.name} height="400"/>  */}
        </div>

        </div>
    );
  }

}



export default App;
