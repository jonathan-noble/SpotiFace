import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, Button} from 'reactstrap';
import { animateScroll as scroll } from 'react-scroll'
import Container3 from './Container3';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default class Preference extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activateTracks: false,
      activatePlaylists: false,
      generatedMood: '',
      genres: [],
      feature: [],
      playlists: [],
      tracks: []
    }
  }
  
  retrieveRecommendations(moodGen) {

    scroll.scrollTo(1411); 

    let features = {};

    this.setState( {
      activateTracks: true,
      activatePlaylists: false,
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
        features.acousticness=0.2;
        features.target_danceability=0.2;
        features.target_energy=0.4;
        features.max_loudness= (-1.5);
        features.min_loudness=0.5;
        features.target_instrumentalness=0.7;
        features.target_mode=0;
        features.tempo=100;
        features.valence=0.4;
        break;
      case 'happy':
        features.acousticness=0.5;
        features.target_danceability=1.0;
        features.target_energy=1.0; 
        features.loudness= (-5.5);
        features.max_instrumentalness= 0.6;
        features.min_instrumentalness=0.1;
        features.target_mode=1.0;
        features.tempo=125;
        features.target_valence=1.0;
        break;
      case 'sad':
        features.max_acousticness=0.8;
        features.target_danceability=0.1;
        features.target_energy=0.1;
        features.loudness=(2.5);
        features.max_instrumentalness= 0.8;
        features.min_instrumentalness=0.2;
        features.target_mode=0;
        features.tempo=80;
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
        features.tempo=110;
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
        features.acousticness=0.5;
        features.target_danceability=0.9;
        features.target_energy=0.8;
        features.max_loudness= (-4.5);
        features.min_loudness=1.0;
        features.target_instrumentalness=0.6;
        features.tempo=100;
        features.valence=1.0;
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


    spotifyApi.getAvailableGenreSeeds()
    .then((genre) => {
      // console.log(genre.genres);
      // let _genre = []
      // switch(moodGen) {
      //   case 'happy':
      //     genre.genres[0]
      //     break;

      // }
      console.log(genre.genres[0])
      return genre.genres; // genre.genres[0];
    })
    .then((_genre) => {
      const shuffledGenre = _genre.sort(() => .5 - Math.random());
      let genres = shuffledGenre.slice(0,3).join(',') ;
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
    //   let trackID = [];
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
        track_albumArt: track.album.images[0] ? track.album.images[0].url  : null,
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


  getMoodPlaylist = (generatedMood)  => {
    console.log(generatedMood);

    scroll.scrollTo(1100); 

    this.setState({
      generatedMood,
      activatePlaylists: true,
      activateTracks: false,
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
                    plist_albumArt: plist.images[0] ? plist.images[0].url : null,
                  })).slice(0, 10);

              
          this.setState({ 
            playlists
          });   
            
          }
        }
     })
    .catch((err) => {
      console.error(err);
    })
  }

  generateMood(moodGen) {
    const angryList =  ['Angry Mood', 'Angry', 'Annoyed', 'Bitter', 'Rock', 'Mad', 'Metal', 'Rage', 'Bangers', 'Blues'];
    const scaredList =  ['Scared Mood', 'Scared', 'Stressed', 'Anxious', 'Anxiety', 'Fear', 'Frightened', 'Panic', 'Terrified', 'Afraid', 'Soul', 'Thrill', 'Thriller'];
    const happyList =  ['Happy Mood', 'Happy', 'Celebrate', 'Dance', 'Energy', 'Upbeat', 'Reggae', 'Lively', 'Good Vibes', 'Good', 'Joy', 'Lucky', 'Funk', 'Comedy'];
    const sadList =  ['Sad Mood', 'Sad', 'Heartbroken', 'Sorry', 'Melancholy', 'Pessimistic', 'Unfortunate', 'Punk', ];
    const surprisedList =  ['Surprised Mood', 'Surprised', 'Shocked', 'Wow', 'Amazing', 'Techno', 'Damn', 'Classical', 'EDM'];
    const neutralList =  ['Neutral Mood', 'Neutral', 'Chill', 'Acoustic', 'Relaxed', 'Nature', 'Couch', 'Jazz', 'Study', 'Sleep'];
    const randomList = ['Random Mood', 'Random', 'Shuffle', 'Whatever', 'Okay']

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
        let randomVal = Math.floor(Math.random()*randomList.length);
        return randomList[randomVal];
    }
  }


  render() {

    const {
      activatePlaylists,
      activateTracks,
      generatedMood,
      genres,
      feature,
      playlists,
      tracks,
    } = this.state;
    
    
    const {
        highestPredicted
    } = this.props;


  return(
      <section> 
        <section id="selectPreference">
        <Container fluid>
        <Col xl="12" className="margin-50_center">
          <Row>
          <h1>Choose your preference</h1>
          </Row>
          <Row id="preference-btn-group">
            <Button className="preference-btn" size="lg" color="warning" active={activateTracks ? true : false} onClick={() => this.retrieveRecommendations(highestPredicted.mood)}>SpotiFace Jukebox</Button>  
            <Button className="preference-btn" size="lg" color="warning" active={activatePlaylists ? true : false} onClick={() => this.getMoodPlaylist(this.generateMood(highestPredicted.mood))}>Mood Playlists</Button>                                
          </Row>
        </Col>
        </Container>
        </section>

      <Container3 
        retrieveRecommendations={() => this.retrieveRecommendations(highestPredicted.mood)}
        getMoodPlaylist={() => this.getMoodPlaylist(this.generateMood(highestPredicted.mood))}
        highestPredicted={highestPredicted}
        activatePlaylists={activatePlaylists}
        activateTracks={activateTracks}
        generatedMood={generatedMood}
        genres={genres}
        feature={feature}
        playlists={playlists}
        tracks={tracks}
      />

    </section>
    );
  }
}



