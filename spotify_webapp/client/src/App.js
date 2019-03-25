import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col,
   Navbar, NavbarBrand, Nav, NavItem,
   Button, Fade, Spinner, Alert,
   ListGroup, ListGroupItem, Jumbotron,
   Popover, PopoverBody,
   } from 'reactstrap';
import { faCamera,
        faPlayCircle, faPauseCircle, faStepBackward, faStepForward 
      } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sticky from 'react-sticky-el';
import Webcam from 'react-webcam'; 
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

window.onSpotifyWebPlaybackSDKReady = () => {};


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
      user: {},
      imageData: null,
      mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null},
      highestPredicted: {},
      activateTracks: false,
      activatePlaylists: false,
      generatedMood: '',
      genres: [],
      feature: [],
      playlists: [],
      tracks: [],
      playlistID: "",
      popoverOpen: false,
      alertOpen: false,
      deviceId: "",
      currTrack: {},
      playing: false,
      position: 0,
      duration: 1,
    }
    // this will later be set by setInterval
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1200);
    this.toggleFollow = this.toggleFollow.bind(this);
  }

  componentDidMount() {
    // this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    this.getCurrentUser();


  }

  toggleFollow() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
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


  getCurrentUser() {
    spotifyApi.getMe()
    .then((_user) => {
      console.log(_user);

      const user = {
        name: _user.display_name,
        user_id: _user.id,
        pic: _user.images[0] ? _user.images[0].url : null,
        product: _user.product
      }

      this.setState({
        user
      })
      
     })
    .catch((err) => {
      console.error(err);
    });     
  }


  captureShot = () => {
    const screenshot = this.webcam.getScreenshot();
    let base64Image = screenshot.replace("data:image/jpeg;base64,","");
    this.setState({ 
      imageData: screenshot
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

      let highestPred = arrayOfPredictions.reduce(function(prev, curr) {
        return prev.predict > curr.predict ? prev : curr;
        });

      // let moodDetected = this.generateMood(highestPred.id); // function where it will return a randomized string from a set of "related" and or "associated" mood words 

      console.log(highestPred.id, arrayOfPredictions[0].predict); 

      this.setState( {
        highestPredicted: highestPred
      })

      // this.getMoodPlaylist(moodDetected);
  })
  .catch(error => this.setState({ error,  mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null }, }))
  }
    

  generateMood(moodGen) {
    const angryList =  ['angry mood', 'annoyed', 'bitter', 'rock', 'mad', 'metal'];
    const scaredList =  ['scared mood', 'anxious', 'fear', 'frightened', 'panicked', 'afraid'];
    const happyList =  ['happy mood', 'celebrate', 'dance', 'energy', 'upbeat', 'reggae', 'lively'];
    const sadList =  ['sad mood', 'heartbroken', 'sorry', 'melancholy', 'pessimistic', 'unfortunate'];
    const surprisedList =  ['surprised mood', 'shocked', 'wow', 'amazing', 'techno', 'damn'];
    const neutralList =  ['neutral mood', 'chill', 'acoustic', 'relaxed', 'nature', 'couch'];

    switch(moodGen) {
      case 'angry':
        let angryVal = Math.floor(Math.random()*angryList.length);
        return angryList[angryVal];
      case 'scared':
        let scaredVal = Math.floor(Math.random()*scaredList.length);
        return scaredList[scaredVal];
      case 'happy':
        let happyVal = Math.floor(Math.random()*happyList.length);
        return happyList[happyVal];
      case 'sad':
        let sadVal = Math.floor(Math.random()*sadList.length);
        return sadList[sadVal];
      case 'surprised':
        let surprisedVal = Math.floor(Math.random()*surprisedList.length);
        return surprisedList[surprisedVal];
      case 'neutral':
        let neutralVal = Math.floor(Math.random()*neutralList.length);
        return neutralList[neutralVal];
      default:
        return "Random Mood"
    }
  }

  
  retrieveRecommendations(moodGen) {
    let features = {};
    // moodGen = "sad"

    this.setState( {
      activateTracks: true,
      activatePlaylists: false
    })


    switch(moodGen) {
      case 'angry':
        features.acousticness=0.0;
        features.danceability=0.5;
        features.target_energy=1.0;
        features.target_loudness=(-10.0);
        features.max_instrumentalness=1.0;
        features.min_instrumentalness=0.0;
        features.max_tempo= 180;
        features.min_tempo=70;
        features.target_valence=0.1;
        break;
      case 'scared':
        features.target_danceability=0.2;
        features.target_energy=0.4;
        features.target_instrumentalness=0.7;
        features.max_loudness= (-1.5);
        features.min_loudness=0.5;
        features.target_mode=0;
        features.tempo=100;
        features.valence=0.4;
        break;
      case 'happy':
        features.target_danceability=1.0;
        features.target_energy=1.0; 
        features.max_instrumentalness= 0.6;
        features.min_instrumentalness=0.1;
        features.loudness= (-5.5);
        features.target_mode=1.0;
        features.target_valence=1.0;
        break;
      case 'sad':
        features.max_acousticness=0.8;
        features.target_danceability=0.1;
        features.target_energy=0.1;
        features.max_instrumentalness= 0.8;
        features.min_instrumentalness=0.2;
        features.loudness=(2.5);
        features.target_mode=0;
        features.target_valence=0.0;
        break;
      case 'surprised':
        features.max_acousticness=0.4;
        features.target_danceability=0.7;
        features.target_energy=0.7;
        features.max_instrumentalness=0.8;
        features.min_instrumentalness=0.4;
        features.loudness= (-6.5);
        features.target_mode=1;
        features.valence=0.7;
        break;
      case 'neutral':
        features.acousticness=0.6;
        features.target_danceability=0.5;
        features.target_energy=0.5;
        features.target_instrumentalness=1.0;
        features.loudness= (-0.5);
        features.max_tempo=105;
        features.target_valence=0.5;
        break;
      default:
        features.danceability=0.5;
        features.energy=0.6;
        features.target_valence=0.6;      
        break;
    }

    console.log(features);

    const keys = Object.keys(features);
    // projects data.prediction into an array of object key=prediction pairs
    const feature = keys.map(key => ({
      id: key, 
      val: features[key]
      })
    );
  
    console.log(feature);


    spotifyApi.getAvailableGenreSeeds()
    .then((genre) => {
      // console.log(genre.genres);
      // let _genre = []
      // switch(moodGen) {
      //   case 'happy':
      //     genre.genres[0]
      //     break;

      // }
      return genre.genres;
    })
    .then((_genre) => {
      const shuffledGenre = _genre.sort(() => .5 - Math.random());
      let genres = shuffledGenre.slice(0,5).join(',') ;
      console.log(genres);

      this.setState({
        genres,
        feature
      })

      return spotifyApi.getRecommendations({
        features,
        seed_genres: genres,
        min_popularity: 15,
        limit: 15
      })
    })
    // .then((data) => {
    //   let trackID = []
    //   data.tracks.map( (track) => {
    //       trackID.push(track.id)
    //   })

    //    return spotifyApi.getAudioFeaturesForTracks(trackID)

    // })
    // .then((response) => {
    //   console.log(response);
    // })
    .then((data) => {
      console.log(data);

      const tracks = data.tracks.map( (track) => ({ 
        track_id: track.id, 
        track_name: track.name,
        track_artist: track.artists.map(artist => artist.name).join(", "),
        track_uri: track.uri, 
        track_albumArt: track.album.images[0].url 
      }))

      console.log(tracks.length, "Recommended tracks successfully retrieved.");
  
      this.setState({
         tracks,
      });   

      return tracks;
    })
    .then((track) => {
      const trackUri = track.map((t) => {
         return t.track_uri
      })

       spotifyApi.play( {
        "uris": trackUri
      })
      .catch((err) => {
        console.error(err);
      });  
    })   
  }


  getMoodPlaylist(generatedMood) {
    console.log(generatedMood);

    this.setState({
      generatedMood
    })

    // search playlist that contains whichever mood is labelled
    spotifyApi.searchPlaylists(generatedMood) 
    .then((data) => {
      if(data.playlists.items) {
        if(data.playlists.items.length > 0) {
          console.log('Playlists searched: ', data);
          
          let _items = data.playlists.items.sort( () => {
                      return 10 - (Math.random() * data.playlists.items.length);
                  })

          const playlists = _items
                  .map( (plist) => ({ 
                    plist_id: plist.id, 
                    plist_name: plist.name, 
                    plist_albumArt: plist.images[0].url 
                  })).slice(0, 10);

              
          this.setState({ 
            playlists,
            activatePlaylists: true,
            activateTracks: false
          });   
            
          }
        }
     })
    .catch((err) => {
      console.error(err);
    })
  }

  getTracksToPlay(track_uri) {
    let trackURI = [];
    trackURI.push(track_uri);
    console.log(trackURI);

    spotifyApi.play( {
      "uris": trackURI
    })
  }

  getPlaylistToPlay(plist) {
     
    if(plist != null) {
      let trackIds = [];
      let trackUris = [];
      let p_id = plist.plist_id;
  
      this.setState( {
        playlistID: p_id
      })
  
      spotifyApi.getPlaylistTracks(p_id)
      .then((data) => {
        if(data.items) {
          if(data.items.length > 0) {
            data.items.forEach((item) => {
              trackIds.push(item.track.id);
              trackUris.push(item.track.uri);
            });
            console.log(data.items.length, "Categorized tracks successfully retrieved.");
  
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
  }


  appendPlaylist(u_id, tracks) {
    spotifyApi.createPlaylist(u_id, {name: "SpotiFace's Jukebox" })
    .then((plist) => {
      return plist.id;
    })
    .then((plist_id) => {

      const trackUri = tracks.map((t) => {
        return t.track_uri
        })
    return spotifyApi.addTracksToPlaylist(plist_id, trackUri)
    })
    .then((data) => {
      console.log(data);
    })

    this.setState({
      alertOpen: !this.state.alertOpen
    })
  }

    
  followPlaylist(playlist_id) {
    console.log("You have followed playlist id: ", playlist_id);
    spotifyApi.followPlaylist(playlist_id)
    .catch(e => {
      console.log(e);
    });

    this.setState({
      alertOpen: !this.state.alertOpen
    })
  }

  // when we receive a new update from the player
  currentTrackStateChange(state) {  // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;

      const currTrack = {
        trackName: currentTrack.name,
        albumImg: currentTrack.album.images[0].url,
        artistName: currentTrack.artists
                    .map(artist => artist.name)
                    .join(", ")
      }

      const playing = !state.paused;

      this.setState({
        position,
        duration,
        currTrack,
        playing
      });
    } else {
      // state was null, user might have swapped to another device
      console.log("Looks like you might have swapped to another device?");
    }
  }

  createPlaybackHandlers() {
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
    this.player.on('player_state_changed', state => this.currentTrackStateChange(state));

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
      this.createPlaybackHandlers();
      
      // finally, connect!
      this.player.connect();
    }  else {
      window.location = 'http://localhost:8888'
    }
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
    const { deviceId } = this.state;
    spotifyApi.transferMyPlayback(
      [deviceId],
      {"play": false}
      )
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
      user,
      imageData,
      mood,
      highestPredicted,
      activatePlaylists,
      activateTracks,
      generatedMood,
      genres,
      feature,
      currTrack,
      playing,
      playlists,
      tracks,
      popoverOpen,
      alertOpen,
      playlistID
    } = this.state;


    return(
      <div className="App" >
        {loggedIn ?
        <div>
          <Navbar className="round10top" color="dark" light expand="md">
          <NavbarBrand href="http://localhost:8888"><h3>SpotiFace</h3></NavbarBrand>
          <Nav className="ml-auto" navbar justified>
          <NavItem>
            {  user.pic ?
              <img className="round10" src={user.pic} alt="profile" width="80" />
              :  null }
          </NavItem> 
          <NavItem>
           <p className="white">{user.name} </p> 
          </NavItem>
          </Nav>
          </Navbar>


          <section id="main1"> 
          <Container fluid>
          <Row className="row">
            <Col xl="7" className="margin-150">
             
                <Webcam
                className="webcam-bg round15"
                audio={false}
                ref={node => this.webcam = node}
                screenshotFormat="image/jpeg"
                width={1000}
                height={500}
                videoConstraints={videoConstraints}
                />

            </Col>
          
            <Col xl="4" className="pull-right margin-150">
                <h1>Gewon!</h1>
                <h3>Let me recommend a playlist for<strong><em> you.</em></strong></h3>
                <Button color="primary" onClick={this.captureShot} className="margin-photo" href="#main2" size="lg">Take a photo <FontAwesomeIcon icon={faCamera}/></Button> 
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
               <Button outline size="lg" className="btn-secondary" href="#main1" >One more time?</Button>
               
                { mood.angry ?
                <div>
                <p>angry: {mood.angry} </p>
                <p>scared:   {mood.scared} </p>
                <p>happy:    {mood.happy}</p>
                <p>sad:     {mood.sad}</p>
                <p>surprised:  {mood.surprised}</p>
                <p>neutral:   {mood.neutral}</p>  
                <h2> Your current mood is: {highestPredicted.id} </h2> <br/>
                </div>  : null
               }

            </Col>
          
            <Col xl="7" className="margin-150_lesstop">

              {imageData ? 
                <Fade> <p><img className="main2-img img-responsive pull-right round15" src={imageData} alt="Snapshot"/></p> </Fade>
                : null}

            </Col>          
          </Row>
          </Container>
          </section>


        <section id="selectPreference">
        <Container fluid>
        <Col xl="12" className="margin-50_center">
          <Row>
          <h1>Choose your preference</h1>
          </Row>
          <Row className="margin-70_center">
            <Button size="lg" color="primary" onClick={() => this.retrieveRecommendations(highestPredicted.id)}>SpotiFace Jukebox</Button>  
            <Button size="lg" color="primary" onClick={() => this.getMoodPlaylist(this.generateMood(highestPredicted.id))}>Mood Playlists</Button>                  
          </Row>
        </Col>
        </Container>
        </section>

          <section id="main3">
          <Container fluid>
          <Row className="row">
            <Col sm="7" className="wow fadeInUpBig margin-100">  

            { activateTracks ?
              <Fade>
              <ListGroup>
              <div id="track-container">
              <div id="tracks">
               { tracks.map((track) => {
                  return <ListGroupItem onClick={() => this.getTracksToPlay(track.track_uri)} key={track.track_id} className="track-element"> 
                  <img src={track.track_albumArt} alt="Album Art" width="150" height="150"/>
                  <h4> {track.track_name}</h4>
                  <p> {track.track_artist}</p>
                </ListGroupItem>}) }
                </div>               
              </div>
              </ListGroup>
              <Button outline size="lg" className="btn-secondary" onClick={() => this.appendPlaylist(user.user_id, tracks)}>Add to Library</Button>

              {/*alertOpen ? <Fade in={alertOpen}><Alert color="success">You have added this playlist in your library! </Alert> </Fade>: null*/}
              </Fade> : null }


              {activatePlaylists ?
                <Fade>
                <Carousel
                width={"85%"}
                autoPlay 
                showThumbs={false}
                useKeyboardArrows
                infiniteLoop
                emulateTouch
                centerMode
                centerSlidePercentage={35} 
                onClickItem={( (index) => this.getPlaylistToPlay(playlists[index]))}
                >

                {playlists.map((plist) => {
                    return <div key={plist.plist_id}> 
                    <img className="carousel-items" src={plist.plist_albumArt} alt="Album Art"/>
                    <p> {plist.plist_name}</p>
                    </div>
                   })
                }
              </Carousel> 
              {playlistID ? 
                <Button outline size="lg" className="btn-secondary" onClick={() => this.followPlaylist(playlistID)}>Follow Playlist</Button>  
                :  <div>
                <Button outline size="lg" className="btn-secondary" id="Popover1" type="button">
                  Follow Playlist
                </Button>
                <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={this.toggleFollow}>
                  <PopoverBody>Choose a playlist from the carousel first!</PopoverBody>
                </Popover>
                </div>}
              </Fade> 
              : null   } 

            </Col>
          
            <Col xl="4" className="margin-20">

            { activateTracks ?
              <Fade>
              <Jumbotron fluid className="jumbo pull-right text-right">
              <Container fluid>
                <h1 className="display-3 jumbo-txt">SpotiFace Jukebox</h1>
                <p className="lead jumbo-txt">Tracks based on tuned track attributes according to your mood</p>
                <hr className="my-2" />
                 {feature.map((_feature) => {
                   return <div key={_feature.id}>
                      <p className="jumbo-txt"> {_feature.id}:  {_feature.val} </p>
                   </div>
                 })}

                <hr className="my-2" />
                <p className="jumbo-txt">Genres: {genres} </p>
              </Container>
              </Jumbotron>
              </Fade>  
              : null
            }

            { activatePlaylists ?     
              <Fade>
              <Jumbotron fluid className="jumbo pull-right text-right">
              <Container fluid>
                <h1 className="display-3 jumbo-txt">Mood Playlists</h1>
                <p className="lead jumbo-txt">Public-created playlists that suits your mood</p>
                <hr className="my-2" />
                <p className="jumbo-txt">The category is based on: {generatedMood}</p>
              </Container>
              </Jumbotron>
              </Fade>
             : null
            } 

            </Col>
          </Row>
          </Container>
          </section>
          


          {user.product==="premium" && (playlistID || activateTracks) ? 
            <section className="round10bot" id="player">
            <Container fluid> 
            <Fade>
            <Row className="row">       

                <Col sm="4" className="margin-10" >  
                  { currTrack.albumImg ? 
                    <div>
                    <img src={currTrack.albumImg} alt="album_img" width="140"/>
                    <h3>{currTrack.trackName}</h3>
                    <p>{currTrack.artistName}</p> 
                    </div>
                    : null
                  }
                </Col>   
                <Col sm="6">
                <Sticky mode="bottom" id="player-sticky" className="margin-10">
                  <Fade>
                  <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onPrevClick()}><FontAwesomeIcon icon={faStepBackward}/></Button>
                  <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onPlayClick()}>{playing ? <FontAwesomeIcon icon={faPauseCircle}/>: <FontAwesomeIcon icon={faPlayCircle}/>} </Button>
                  <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onNextClick()}><FontAwesomeIcon icon={faStepForward}/></Button>  
                  </Fade>
                  </Sticky>
                </Col>
            </Row>
            </Fade> 
            </Container>    
            </section>
: null 
           }


        </div>  :          
          <html>
          <body>
          <h1>Your token expired!</h1>
          <Button onClick={() => { window.location = 'http://localhost:8888' }} 
          style={{ position: "sticky", padding: '25px', 'font-size': '50px', 'margin-left': '40%'}}>Sign back in</Button>
          {/* TODO: use the proper URL for the second condition of an implemented ternary operator once established */}
          </body>

          </html>
        }          
      </div>
      
    );
  }
}
