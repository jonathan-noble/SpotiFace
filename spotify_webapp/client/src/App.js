import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col,
   Navbar, NavbarBrand, 
   Button, 
   Spinner,
   } from 'reactstrap';
import Webcam from 'react-webcam'; 
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


window.onSpotifyWebPlaybackSDKReady = () => {};


let global_plist_id = "";


export default class App extends Component {  

  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    

    this.state = {
      _token: token,
      loggedIn: token ? true : false,
      imageData: null,
      mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null},
      playlists: [],
      showPlaylistAndCarousel: false,
      deviceId: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 1,
    }
    // this will later be set by setInterval
    this.playerCheckInterval = null;

  }

  componentWillMount() {
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
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
    this.setState( {
      mood: {
        angry: data.prediction.angry,
        scared: data.prediction.scared,
        happy: data.prediction.happy,
        sad: data.prediction.sad,
        surprised: data.prediction.surprised,
        neutral: data.prediction.neutral,
      }
    })

    const keys = Object.keys(data.prediction);
    // projects data.prediction into an array of object key=prediction pairs
    const arrayOfPredictions = keys.map(key => ({
      id: key, 
      predict: data.prediction[key]
      })
    );
    console.log(arrayOfPredictions);
    console.log(arrayOfPredictions[0].predict);

    let highestPred = arrayOfPredictions.reduce(function(prev, curr) {
      return prev.predict > curr.predict ? prev : curr;
  });

  let moodDetected = this.generateMood(highestPred.id); // function where it will return a randomized string from a set of "related" and or "associated" mood words 

  console.log(highestPred.id); 
  console.log(moodDetected); 


  let top3_pred = arrayOfPredictions
    .sort((a, b) => {
      return b.predict - a.predict;
    }).slice(0,3);
  console.log(top3_pred);

  this.setState( {
    top3: [...top3_pred]
  })

  this.getMoodPlaylist(moodDetected);



  })
  .catch(error => this.setState({ error,  mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null }, }))
  }
    

  generateMood(moodGen) {
    const happyList =  ['happy mood', 'celebrate', 'dance', 'energy', 'boost', 'reggae'];
    const neutralList =  ['neutral mood', 'chill', 'acoustic', 'relaxed', 'nature', 'couch'];
    const surprisedList =  ['surprised mood', 'shocked', 'wow', 'amazing', 'techno', 'damn'];

    switch(moodGen) {
      case 'happy':
        let happyVal = Math.floor(Math.random()*happyList.length);
        return happyList[happyVal];
      case 'neutral':
        let neutralVal = Math.floor(Math.random()*neutralList.length);
        return neutralList[neutralVal];
      case 'surprised':
      let surprisedVal = Math.floor(Math.random()*surprisedList.length);
      return surprisedList[surprisedVal];
      default:
        return "Mood"
    }
  }


  getMoodPlaylist(labelledMood) {
    // search playlist that contains whichever mood is labelled
    // spotifyApi.search(label_from_json, ["playlist", "album", "track"])
    // search playlist that contains whichever mood is labelled

    spotifyApi.searchPlaylists(labelledMood) 
    .then((data) => {
      if(data.playlists.items) {
        if(data.playlists.items.length > 0) {
          console.log('Playlists searched: ', data);
          
          const playlistsWrangled = data.playlists.items.map(plist => ({ 
            plist_id: plist.id, 
            name: plist.name, 
            albumArt: plist.images[0].url 
          }));

          console.log(playlistsWrangled);
          
          this.setState({ playlists: playlistsWrangled  });   
            
            // showPlaylistAndCarousel: !this.state.showPlaylistAndCarousel
          }
        }
     })
    .catch((err) => {
      console.error(err);
    })
  }


  checkPlaylists(p_index) {
    // let playlist = p_index(0);
    console.log(p_index);
  }


  getPlaylistTracks(plist) {
    let trackIds = [];
    let trackUris = [];
    let p_id = plist.plist_id;
    global_plist_id = p_id; 

    spotifyApi.getPlaylistTracks(p_id)
    .then((data) => {
      if(data.items) {
        if(data.items.length > 0) {
          data.items.forEach((tracks) => {
            trackIds.push(tracks.track.id);
            trackUris.push(tracks.track.uri);
          })
          ;
          console.log(data.items.length, "Tracks successfully retrieved.");

          spotifyApi.play( {
            "uris": trackUris   
          })
          .catch((err) => {
            console.error(err);
          });       
        }
      }
    })
    .catch((err) => {
      console.error(err);
    }); 
  }

    
  followPlaylist(playlist_id) {
    console.log("You have followed playlist id: ", playlist_id);
    spotifyApi.followPlaylist(playlist_id)
    .catch(e => {
      console.log(e);
    });
  }

  getRecommendations() {
    spotifyApi.getRecommendations("Rock")
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


  // when we receive a new update from the player
  onStateChanged(state) {  // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
                        .map(artist => artist.name)
                        .join(", ");
      const playing = !state.paused;

      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    } else {
      // state was null, user might have swapped to another device
      this.setState({ error: "Looks like you might have swapped to another device?" });
    }
  }

  createEventHandlers() {
    // problem setting up the player
    this.player.on('initialization_error', e => { console.error(e); });
    // problem authenticating the user.
    // either the token was invalid in the first place,
    // or it expired (it lasts one hour)
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    // currently only premium accounts can use the API
    this.player.on('account_error', e => { console.error(e); });
    // loading/playing the track failed for some reason
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      // set the deviceId variable, then let's try
      // to swap music playback to *our* player!
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  } 

  checkForPlayer() {
    const { _token } = this.state;
    
    // if the Spotify SDK has loaded
    if (window.Spotify !== null) {
      // cancel the interval
      clearInterval(this.playerCheckInterval);
      // create a new player
      this.player = new window.Spotify.Player({
        name: "SpotiFace",
        getOAuthToken: cb => { cb(_token); },
      });
      // set up the player's event handlers
      this.createEventHandlers();
      
      // finally, connect!
      this.player.connect();
    }
  }

  updateCurrentlyPlaying(track) {

  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();

  }

  onNextClick() {
    this.player.nextTrack();
  }

  transferPlaybackHere() {
    const { deviceId, _token } = this.state;
    // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        // true: start playing music if it was paused on the other device
        // false: paused if paused on other device, start playing music otherwise
        "play": false,
      }),
    });
  }
  
//render the objects
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    const {
      loggedIn,
      imageData,
      mood,
      trackName,
      artistName,
      albumName,
      playing,
      playlists,
    } = this.state;

    return(
      <div className="App" >
        {loggedIn ?
        <div>
          <Navbar color="dark" light expand="md">
          <NavbarBrand>SpotiFace</NavbarBrand>

          {/*  <Button href='http://localhost:8888' className="btn btn-secondary btn-lg">Log Out
              <i className="fa fa-dribbble"></i></Button>*/}
          </Navbar>

            
          <section id="main1"> 
          <Container fluid>
          <Row className="row">
            <Col xl="7" className="margin-150">
                <Webcam
                audio={false}
                ref={node => this.webcam = node}
                screenshotFormat="image/jpeg"
                width={1000}
                height={500}
                videoConstraints={videoConstraints}
                />
            </Col>
          
            <Col xl="3" className="pull-right text-right margin-150">
                <h1>Take a photo!</h1>
                <h3>Let me recommend a playlist<strong><em> for you!</em></strong></h3>
                <a onClick={this.captureShot} href="#main2" className="btn btn-primary btn-lg">Take a photo<i className="fa fa-cloud-download"></i></a>

            </Col>
          </Row>
          </Container>
          </section>


          <section id="main2">
          <Container fluid>
          <Row className="row">
            <Col sm="3" className="pull-left text-left margin-100">
   { /*  
                <div>{mood.map((item) => (<div>{item.desc + ' ' + item.expense}</div>))}</div>    */ } 
                <p>angry: {mood.angry} </p>
                <p>scared:   {mood.scared} </p>
                <p>happy:    {mood.happy}</p>
                <p>sad:     {mood.sad}</p>
                <p>surprised:  {mood.surprised}</p>
                <p>neutral:   {mood.neutral}</p>  
                <h2> Your current mood is: </h2> <br/>
                             
               <a href="#main1" className="btn btn-secondary btn-lg">One more time?<i className="fa fa-envelope"></i></a>  
            </Col>
          
            <Col xl="7" className="margin-150_lesstop">
              {imageData ? 
                <p><img className="main2-img img-responsive pull-right" src={imageData} alt="Snapshot"/></p>
                : null}
            </Col>
              
          </Row>
          </Container>
          </section>

          <section id="main3">
          <Container fluid>
          <Row className="row">
            <Col sm="7" className="wow fadeInUpBig margin-100">
              <Carousel
                width={"85%"}
                autoPlay 
                showThumbs={false}
                useKeyboardArrows
                infiniteLoop
                emulateTouch
                centerMode
                onClickItem={((index) => this.getPlaylistTracks(playlists[index]))}
                >
                { playlists ? 
                  playlists.map((plist) => {
                    return <div key={plist.plist_id}> 
                    <img src={plist.albumArt} alt="Album Art"/>
                    <p className="legend"> {plist.name}</p>
                    </div>
                   }) : <Spinner />
                }
              </Carousel>

              
            </Col>
          
            <Col xl="3" className="pull-right text-right margin-20">
              <br />

              <Button onClick={() => this.followPlaylist(global_plist_id)}>
                Follow Playlist
              </Button>

                {/*              {_playlists}
              <img src={playlists.albumArt[1]}/> */}

            
                

            
              
            </Col>
          </Row>
          </Container>
          </section>
          

          <section id="main1">
          <Container fluid> 
          <Row className="row">       
              <div>      
              <p>Artist: {artistName}</p>
              <p>Track: {trackName}</p>
              <p>Album: {albumName}</p>
              <p>
                <Button onClick={() => this.onPrevClick()}>Previous</Button>
                <Button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</Button>
                <Button onClick={() => this.onNextClick()}>Next</Button>
              </p>
            </div>

          </Row>
          </Container>    
          </section>

        </div>  :          
          <html>
          <body>
          <Button onClick={() => { window.location = 'http://localhost:8888' }} 
          style={{ position: "sticky", padding: '25px', 'font-size': '50px', 'margin-left': '40%'}}>Sign in with Spotify</Button>
          {/* TODO: use the proper URL for the second condition of an implemented ternary operator once established */}
          </body>

          </html>
        }          
      </div>
      
    );
  }
}
