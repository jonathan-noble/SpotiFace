import React, { Component } from 'react';
import styles from './App.css';
import Webcam from 'react-webcam'; 
import SpotifyWebApi from 'spotify-web-api-js';
import $ from 'jquery';
const spotifyApi = new SpotifyWebApi();
require('tracking')
require('tracking/build/data/face')


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
  
  tracker = null

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
      angry: "",
      scared: "",
      happy: "",
      sad: "",
      surprised: "",
      neutral: "",
      moodSearch: { name: 'Not Found', albumArt: ''},
      player: { user_id: '', plist_id: '' }
    }
  }

  componentDidMount() {
  //   this.tracker = new window.tracking.ObjectTracker('face')
  //   this.tracker.setInitialScale(4)
  //   this.tracker.setStepSize(2)
  //   this.tracker.setEdgesDensity(0.1)

  //   window.tracking.track(this.refs.cameraOutput, this.tracker, { camera: true })
  //   this.tracker.on('track', event => {
  //     let context = this.refs.canvas.getContext('2d')
  //     context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
  //     event.data.forEach(function(rect) {
  //       context.strokeStyle = '#a64ceb'
  //       context.strokeRect(rect.x, rect.y, rect.width, rect.height)
  //       context.font = '11px Helvetica'
  //       context.fillStyle = "#fff"
  //       context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
  //       context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
  //     })
  //   })

  
  }

  componentWillUnmount () {
  //   this.tracker.removeAllListeners()
  }

  captureShot = () => {
    // let base64Image;
    const screenshot = this.webcam.getScreenshot();
    this.setState({ imageData: screenshot });
    // console.log(screenshot);

    // var url = "url/action";                
    // var blob = base64ToBlob(screenshot, 'image/jpeg');                
    // var formData = new FormData();
    // formData.append('picture', blob);
    
    // $.ajax({
    //     url: url, 
    //     type: "POST", 
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     data: formData})
    //     .done(function(e){
    //         alert('done!');
    //     });

		// $("#predict-button").click(function(event){
		// 	let message = {
		// 		image: screenshot
		// 	}
		// 	console.log(message);
		// 	$.post("http://127.0.0.1:5000/pyimagesearch/predict",JSON.stringify(message),function(response){
		// 		$("#angry").text(response.prediction.angry.toFixed(6));
		// 		$("#scared").text(response.prediction.scared.toFixed(6));
		// 		$("#happy").text(response.prediction.happy.toFixed(6));
		// 		$("#sad").text(response.prediction.sad.toFixed(6));
		// 		$("#surprised").text(response.prediction.surprised.toFixed(6));
		// 		$("#neutral").text(response.prediction.neutral.toFixed(6));
		// 		console.log(response);
		// 	});
		// });
  }

  // base64ToBlob(base64, mime) 
  // {
  //   mime = mime || '';
  //   var sliceSize = 1024;
  //   var byteChars = window.atob(base64);
  //   var byteArrays = [];

  //   for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
  //       var slice = byteChars.slice(offset, offset + sliceSize);

  //       var byteNumbers = new Array(slice.length);
  //       for (var i = 0; i < slice.length; i++) {
  //           byteNumbers[i] = slice.charCodeAt(i);
  //       }

  //       var byteArray = new Uint8Array(byteNumbers);

  //       byteArrays.push(byteArray);
  //   }

  //   return new Blob(byteArrays, {type: mime});
  // }


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

          {/*    
           <button id="predict-button">Predict</button>
           <p style="font-weight:bold">Predictions</p>
           <p>angry: <span id="angry"></span></p>
           <p>scared:   <span id="scared"></span></p>
           <p>happy:   <span id="happy"></span></p>
           <p>sad:    <span id="sad"></span></p>
           <p>surprised:   <span id="surprised"></span></p>
           <p>neutral:    <span id="neutral"></span></p>
          */}

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
