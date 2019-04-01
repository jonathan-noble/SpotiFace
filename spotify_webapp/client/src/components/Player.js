import React, { Component } from 'react';
import { Container, Row, Col,
  Button, Fade, Spinner, Alert,
  } from 'reactstrap';
import {  faPlayCircle, faPauseCircle, faStepBackward, faStepForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sticky from 'react-sticky-el';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

window.onSpotifyWebPlaybackSDKReady = () => {};


export default class Player extends Component {

  constructor(props) {
    super(props);

    let _token = spotifyApi.getAccessToken();


    this.state = {
      _token,
      user: {},
      playlistID: "",
      deviceId: "",
      currTrack: {},
      playing: false,
      position: 0,
      duration: 1,
    }

    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);

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

  render() {

    const {
      currTrack,
      playing
    } = this.state;

    const {
      user,
      activateTracks,
      playlistID
    } = this.props;


    return(
      <section> 
      { (user.product==="premium") && (playlistID || activateTracks) ? 
      <section className="round10bot" id="player">
      <Container fluid> 
      <Fade>
      <Row className="row">       

          <Col sm="4" className="margin-10" >  
            { currTrack.albumImg ? 
              <div id="currTrack">
              <img src={currTrack.albumImg} alt="album_img" width="140"/>
              <h3>{currTrack.trackName}</h3>
              <p>{currTrack.artistName}</p> 
              </div>
              : null
            }
          </Col>   
          <Col sm="6">
          <Sticky mode="bottom" className="margin-10">
            <Fade>
            <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onPrevClick()}><FontAwesomeIcon size="lg" icon={faStepBackward}/></Button>
            <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onPlayClick()}>{playing ? <FontAwesomeIcon size="2x" icon={faPauseCircle}/>: <FontAwesomeIcon size="2x" icon={faPlayCircle}/>} </Button>
            <Button active size="lg" color="secondary" className="player-btn" onClick={() => this.onNextClick()}><FontAwesomeIcon size="lg" icon={faStepForward}/></Button>  
            </Fade>
            </Sticky>
          </Col>
      </Row>
      </Fade> 
      </Container>    
      </section> : null }
      </section>
      );
    }
};