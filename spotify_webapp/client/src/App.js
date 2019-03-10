import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col,
   Navbar, NavbarBrand, 
   Button, 
   } from 'reactstrap';
import Webcam from 'react-webcam'; 
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();



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
      mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null},
      spotify_data: null,
      top3: [],
      carouselItem1: { name: 'Not Found', albumArt: ''},
      carouselItem2: { name: 'Not Found', albumArt: ''},
      carouselItem3: { name: 'Not Found', albumArt: ''},
      player: { user_id: '', plist_id: '' },
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
    // console.log(response);
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

  
          // search playlist that contains whichever mood is labelled
    // spotifyApi.search(label_from_json, ["playlist", "album", "track"])
    // search playlist that contains whichever mood is labelled
    spotifyApi.searchPlaylists(moodDetected) // remove "Mood" once function generateMood is done
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
        break;
      case 'neutral':
        let neutralVal = Math.floor(Math.random()*neutralList.length);
        return neutralList[neutralVal];
        break;
      case 'surprised':
      let surprisedVal = Math.floor(Math.random()*surprisedList.length);
      return surprisedList[surprisedVal];
      break;
      default:
        return "Mood"
    }
  }

  choosePlaylist(carouselItem, _randNum) {
    this.setState( {
        player: {
            user_id: carouselItem.playlists.items[_randNum].owner.id,
            plist_id: carouselItem.playlists.items[_randNum].id
        }
      })
    }
    
    updatePlaylist(carouselItem1, randumz) {
      console.log("Updated playlist data: ", carouselItem1);
    }

    
  followPlaylist(playlist_id) {
    console.log(playlist_id);
    spotifyApi.followPlaylist(playlist_id)
    .catch(e => {
      console.log(e);
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
      spotify_data,
      carouselItem1,
      carouselItem2,
      carouselItem3,
      player,
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
                {/*
                    <div>
                  <form action={"spotify:user:" + player.user_id + ":playlist:" + player.plist_id}>
                  <input type="image" src="spotify.png" alt="Open Spotify" width="115" height="60"/>
                  </form>
                </div>
                */}

                  <div>
                  <iframe src={"https://open.spotify.com/embed/user/" + player.user_id + "/playlist/" + player.plist_id}
                    width="600" height="1000" frameBorder="1" allowtransparency="true" allow="encrypted-media"></iframe>
                  </div>
                  {/*}
                  <iframe src="https://open.spotify.com/embed/track/2xxMCCFva1GRQAYl2rlrpM" 
                  width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                */}
            </Col>
          
            <Col xl="3" className="pull-right text-right margin-20">

               {/* { loggedIn &&
                  <Button onClick={() => this.getMoodPlaylist(labelledMood)}>
                    Get Mood Playlist
                  </Button>
                }  */} 
                <br />

              <Button onClick={() => this.followPlaylist(player.plist_id)}>
                Follow Playlist
              </Button>

                <Carousel
                   autoPlay 
                   showThumbs={false}
                   useKeyboardArrows
                   infiniteLoop
                   emulateTouch
                   centerMode
                   onClickItem={this.updatePlaylist(spotify_data, 1)}
                   >
                 {/* onClickItem={this.choosePlaylist(carouselItem1, 1)} */}
                <div>
                   <img src={carouselItem1.albumArt}  alt="Album Art"/>
                    <p className="legend"> {carouselItem1.name}</p>
                </div>
                <div>
                  <img src={carouselItem2.albumArt} alt="Album Art"/>
                    <p className="legend">{carouselItem2.name}</p>
                </div>
                <div>
                  <img src={carouselItem3.albumArt} alt="Album Art"/>
                    <p className="legend">{carouselItem3.name}</p>
                </div>
                <div>
                  <img src={carouselItem1.albumArt} alt="Album Art"/>
                  <p className="legend">Legend 4</p>
                </div>
                <div>  
                  <img src={carouselItem2.albumArt} alt="Album Art"/>
                  <p className="legend">Legend 5</p>
                </div>

               </Carousel>
           
            </Col>
              
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
