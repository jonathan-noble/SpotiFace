import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


// $.getJSON('label.json', function(data) {
//     alert(data);
// });

// let labelledMood =  "happy";



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
           console.log(data); },
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
        // moodSearch: { name: 'Not Found'}
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
    // search tracks whose name, album or artist contains 'Love'
    spotifyApi.searchPlaylists(label_from_json + " Mood")
      .then(function(data) {
        // this.setState( {
        //   moodSearch: {
        //     name: response.item.name
        //   }
        // })
        console.log('Mood searched: ', data);
        // $('playlist').append()
      }, function(err) {
        console.error(err);
      });
  }

//create a new function

  render() {
    return(
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
    {/*    <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        */}
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
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
