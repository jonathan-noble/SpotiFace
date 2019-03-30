import React, { Component } from 'react';
import '../App.css';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Navi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
            }
    }

        
    componentDidMount() {
        this.getCurrentUser();
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

      
    render() {
        const {
         user
          } = this.state;

    return(
      <section>
          <Navbar className="round10top" color="dark" light expand="md">
          <NavbarBrand href="http://localhost:8888"><h1>SpotiFace</h1></NavbarBrand>
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
      </section>
     );
    }
}

