import React, { Component } from 'react';
import './App.css';
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

let labelledMood = "";
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
        moodSearch: { name: 'Not Found', albumArt: ''},
        player: { user_id: '', plist_id: '' }
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

        let randNum = Math.floor((Math.random() * 20) + 0);

        this.setState({
          moodSearch: {
            name: data.playlists.items[randNum].name,
            albumArt: data.playlists.items[randNum].images[0].url,
          },
          player: {
            user_id: data.playlists.items[randNum].owner.id,
            plist_id: data.playlists.items[randNum].id
          }
        });

      })

      .catch((err) => {
        console.error(err);
      })
  }


//render the objects
  render() {
    return(
      <div className="App">
        {this.state.loggedIn ?
        <div>
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

          {/* TODO: use loader: show/hide for making the iframe pop up when button is pressed  */}

          <div>
          <iframe src={"https://open.spotify.com/embed/user/" + this.state.player.user_id + "/playlist/" + this.state.player.plist_id} width="300" height="380" frameBorder="0" allowtransparency="false" allow="encrypted-media"></iframe>
          </div>

          <div>
          <form action={"spotify:user:" + this.state.player.user_id + ":playlist:" + this.state.player.plist_id}>
          <input type="image" src="spotify.png" alt="Open Spotify" width="115" height="60"/>
          </form>
          </div>
        </div>  : <button onClick={() => {
            window.location = 'http://localhost:8888/login' }
          }
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
        }
            {/* TODO: use the proper URL for the second condition of an implemented ternary operator once established */}
      </div>
    );
  }

}

export default App;
