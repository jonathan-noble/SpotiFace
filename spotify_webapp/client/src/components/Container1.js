import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, Button} from 'reactstrap';
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Webcam from 'react-webcam'; 
import Container2 from './Container2';
import Preference from './Preference';


export default class Container1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageData: null,
            mood: { angry: null, scared: null, happy: null, sad: null, surprised: null, neutral: null},
            highestPredicted: {},
            }
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
        

      
    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
            };

        const {
            imageData,
            mood,
            highestPredicted
        } = this.state;


    return(
      <section>
        <section id="container1"> 
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

            <Button color="primary" onClick={this.captureShot} className="camera-btn" href="#container2" size="lg"><FontAwesomeIcon icon={faCamera}/></Button>     
            </Col>
        
            <Col xl="4" className="pull-right margin-150">
                <h1>Give it a go!</h1>
                <h3>Let SpotiFace recommend a playlist for<strong><em> you</em></strong>.</h3>
            </Col>
        </Row>
        </Container>
        </section>
                
        <Container2 imageData={imageData} mood={mood} highestPredicted={highestPredicted}/>
        <Preference highestPredicted={highestPredicted}/>
      </section>  
     );
    }

    
}
