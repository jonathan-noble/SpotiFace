import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import Webcam from 'react-webcam'; 
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


export default class App extends Component {  
  
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      imageData: null,
      tab: 0,
      mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null },
      moodSearch: { name: 'Not Found', albumArt: ''},
      player: { user_id: '', plist_id: '' }
    }
  }

  componentDidMount() {
  
  }

  captureShot = () => {
    const screenshot = this.webcam.getScreenshot();
    let base64Image = screenshot.replace("data:image/jpeg;base64,","");
    this.setState({ 
      imageData: screenshot,
     });

    let message = {
      image: base64Image
    }

   fetch('http://127.0.0.1:5000/', {
    method: 'post',
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(message)
    })
  .then((response) => {
    return response.json();  //response.json() is resolving its promise. It waits for the body to load
  })
  .then((data) => {
    let percent = 100;
    this.setState( {
      mood: {
        angry: (data.prediction.angry.toFixed(3) * percent),
        scared: (data.prediction.scared.toFixed(3) * percent),
        happy: (data.prediction.happy.toFixed(3)* percent),
        sad: (data.prediction.sad.toFixed(3)* percent),
        surprised: (data.prediction.surprised.toFixed(3)* percent),
        neutral: (data.prediction.neutral.toFixed(3)* percent),
      }

    })
  })
  // .sort((data) => { 
  //   let highest = (data.prediction.slice(0, 3));
  //   console.log(highest);
  // })
   .catch(error => this.setState({ error,  mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null }, }));
  }


  onClickRetake = (e) => {
    e.persist();
    this.setState({ imageData: null });
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

    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

  
    return(
      <div className="App">
        {this.state.loggedIn ?
        <div>

        {/*
          <div className="container" style={styles}>
            <div className="cameraOutput" style={styles}>
              <video ref="cameraOutput" width="320" height="240" preload="false" autoPlay="{true}"></video>
              <canvas ref="canvas" width="320" height="240"></canvas>
            </div>
          </div>
          <button onClick={ () => this.snapshot()}>Take Snapshot</button> 
        */}
             <div>
             <h1>react-webcam</h1>
             <Webcam
               audio={false}
               ref={node => this.webcam = node}
               screenshotFormat="image/jpeg"
               width={350}
               videoConstraints={videoConstraints}
             />
             <div>
               <h2>Screenshots</h2>
               <div className='screenshots'>
                 <div className='controls'><button onClick={this.captureShot}>capture</button></div>
                 {this.state.imageData ? 
                  <div>
                  <p><img src={this.state.imageData} alt=""/></p>
                  <span><button onClick={this.onClickRetake}>Retake</button></span>
                  </div>
                  : null}
               </div>
             </div>
           </div>

{   /*       <p style="font-weight:bold">Predictions</p> */}
           <p>angry: {this.state.mood.angry} </p>
           <p>scared:   {this.state.mood.scared} </p>
           <p>happy:    {this.state.mood.happy}</p>
           <p>sad:     {this.state.mood.sad}</p>
           <p>surprised:  {this.state.mood.surprised}</p>
           <p>neutral:   {this.state.mood.neutral}</p>
        

          <div>
            Mood search: { this.state.moodSearch.name }
          </div>

           {/* TODO: Allow the user to choose from set of playlist stored in a carousel*/}
          <div>
            <img src={this.state.moodSearch.albumArt} alt="Album Art" style={{ height: 150 }}/>
          </div>

          { this.state.loggedIn &&
            <button onClick={() => this.getMoodPlaylist(labelledMood)}>
              Get Mood Playlist
            </button>
          }

          {/* TODO: use loader: show/hide for making the iframe pop up when button is pressed  */}

          <div>
          <iframe title="Player" src={"https://open.spotify.com/embed/user/" + this.state.player.user_id + "/playlist/" + this.state.player.plist_id} width="300" height="380" frameBorder="0" allowtransparency="false" allow="encrypted-media"></iframe>
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
