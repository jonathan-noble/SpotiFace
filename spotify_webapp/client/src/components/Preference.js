import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, Button} from 'reactstrap';
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
        features.danceability=1.0;
        features.energy=1.0;
        features.target_valence=1.0;      
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


  getMoodPlaylist = (generatedMood)  => {
    console.log(generatedMood);

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
                    plist_albumArt: plist.images[0].url 
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
          <Row className="margin-70_center">
            <Button size="lg" color="primary" onClick={() => this.retrieveRecommendations(highestPredicted.id)}>SpotiFace Jukebox</Button>  
            <Button size="lg" color="primary" onClick={() => this.getMoodPlaylist(this.generateMood(highestPredicted.id))}>Mood Playlists</Button>                                
          </Row>
        </Col>
        </Container>
        </section>

      <Container3 
        retrieveRecommendations={() => this.retrieveRecommendations(highestPredicted.id)}
        getMoodPlaylist={() => this.getMoodPlaylist(this.generateMood(highestPredicted.id))}
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



