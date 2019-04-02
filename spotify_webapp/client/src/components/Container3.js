import React, { Component} from 'react';
import '../App.css';
import { Container, Row, Col, 
    Button, Fade,
    ListGroup, ListGroupItem, Jumbotron,
    UncontrolledPopover, PopoverBody, UncontrolledAlert } from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { animateScroll as scroll } from 'react-scroll'
import { Carousel } from 'react-responsive-carousel';
import Player from './Player';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default class Container3 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            playlistID: "",
            trackAlertOpen: false,
            plistAlertOpen: false
        }
    }

    componentDidMount() {
        this.getCurrentUser();
    }

    getCurrentUser() {
        spotifyApi.getMe()
        .then((_user) => {  
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

    

    getTracksToPlay(track_uri) {
        scroll.scrollTo(1650); 
        let trackURI = [];
        trackURI.push(track_uri);
        console.log(trackURI);

        spotifyApi.play( {
        "uris": trackURI
        })
    }

    getPlaylistToPlay(plist) {
        
     scroll.scrollTo(1650); 
        
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

        this.setState({
            trackAlertOpen: !this.state.trackAlertOpen
        })

        spotifyApi.createPlaylist(u_id, {name: "SpotiFace Jukebox" })
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
            console.log("You have successfully created a playlist with snapshot:", data);
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
           plistAlertOpen: !this.state.plistAlertOpen
        })
    }

    render() {

        const {
            user,
            playlistID,
            trackAlertOpen,
            plistAlertOpen
        } = this.state;


        const {
            highestPredicted,
            retrieveRecommendations,
            getMoodPlaylist,
            activateTracks,
            activatePlaylists,
            generatedMood,
            genres,
            feature,
            playlists,
            tracks
        } = this.props;

    return(
        <section>

            <section id="container3">
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
 
                </Fade> : null }


                {activatePlaylists ?
                    <Fade>
                    <Carousel
                    width={"95%"}
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
                </Fade> 
                : null   } 


                </Col>
            
                <Col xl="4" className="margin-minus_40">

                { activateTracks ?
                <Fade>
                <Jumbotron fluid className="jumbo pull-right text-right">
                <Container fluid>
                    <h1 className="display-3 jumbo-txt">SpotiFace Jukebox</h1>
                    <p className="lead jumbo-txt">Fresh, algorithm-picked tracks based on tuneable track attributes corresponding to your mood being <strong>{highestPredicted.mood}</strong>!</p>
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
                <div id="container3-btn-group"> 
                    <Button outline className="container3-btn" color="secondary" size="lg" onClick={retrieveRecommendations}>Reload</Button>  
                    <Button outline className="container3-btn" color="secondary" size="lg" onClick={() => this.appendPlaylist(user.user_id, tracks)}>Add to Library</Button>
                </div>
               
                {trackAlertOpen ? 
                    <UncontrolledAlert color="success">
                    You have added this playlist in your library! 
                    </UncontrolledAlert>
                  : null}

                </Fade>  
                : null
                }

                { activatePlaylists ?     
                <Fade>
                <Jumbotron fluid className="jumbo pull-right text-right">
                <Container fluid>
                    <h1 className="display-3 jumbo-txt">Mood Playlists</h1>
                    <p className="lead jumbo-txt">Choose a public-created playlist that suits your mood</p>
                    <hr className="my-2" />
                    <p className="jumbo-txt">The category is based on: {generatedMood}</p>
                </Container>
                </Jumbotron>
                
                {playlistID ? 
                    <div id="container3-btn-group"> 
                    <Button outline size="lg" className="container3-btn" color="secondary" onClick={getMoodPlaylist}>Reload</Button>  
                    <Button outline size="lg" className="container3-btn" color="secondary" onClick={() => this.followPlaylist(playlistID)}>Follow Playlist</Button>  
                    </div>
                    :  <div id="container3-btn-group">
                    <Button outline size="lg" className="container3-btn" color="secondary" onClick={getMoodPlaylist}>Reload</Button>  
                    <Button outline size="lg" className="container3-btn" color="secondary" id="PopoverFollow" type="button">
                    Follow Playlist
                    </Button>
                    <UncontrolledPopover placement="right" trigger="legacy" target="PopoverFollow">
                    <PopoverBody>Choose a playlist from the carousel first!</PopoverBody>
                    </UncontrolledPopover>

                    </div>}
                
                {plistAlertOpen ? 
                    <UncontrolledAlert color="success">
                      You have successfully followed the playlist!
                    </UncontrolledAlert>
                  : null}
                
                </Fade>
                : null
                } 

                </Col>
            </Row>
            </Container>
            </section>

        
                <Player 
                user={user}
                activateTracks={activateTracks}
                playlistID={playlistID}
                />

        </section>
     );
    }
}

