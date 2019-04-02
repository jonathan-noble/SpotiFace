import React, { Component } from 'react';
import './App.css';
import {   Button  } from 'reactstrap';
import { Events} from 'react-scroll'
import SpotifyWebApi from 'spotify-web-api-js';
import Navi from './components/Navi';
import Container1 from './components/Container1';

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
      loggedIn: token ? true : false
    }

  }

  componentDidMount() {
    Events.scrollEvent.register('begin', function () {
      console.log("begin", arguments);
    });

    Events.scrollEvent.register('end', function () {
      console.log("end", arguments);
    });

  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
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

    const {
      loggedIn,
    } = this.state;


    return(
      <div className="App" >
        {loggedIn ?
        <div>

          <Navi/>
          <Container1 />
        
        </div>
          : <html>
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
