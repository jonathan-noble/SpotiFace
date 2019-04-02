import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, 
        Button, UncontrolledPopover, PopoverHeader, PopoverBody
      } from 'reactstrap';
import { faCamera, faUpload,
  // faAngry, faFlushed, faSmileBeam, faSurprise, faSadTear, faMeh
 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { animateScroll as scroll } from 'react-scroll'
import Webcam from 'react-webcam'; 
import ReactFileReader from 'react-file-reader';
import Container2 from './Container2';
import Preference from './Preference';
import angry from '../images/angry.jpg';
import scared from '../images/scared.jpg';
import happy from '../images/happy.jpg';
import sad from '../images/sad.jpg';
import surprised from '../images/surprised.jpg';
import neutral from '../images/neutral.jpg';


export default class Container1 extends Component {

  constructor(props) {
      super(props);
      this.state = {
          imageData: null,
          predictions: {},
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

    scroll.scrollTo(600); 

    let predictions = {
      "angry":50,
      "sad": 64,
      "happy":52,
      "neutral":10,
      "surprised":23,
      "scared": 5
    }
  
    const keys = Object.keys(predictions);
    const arrayOfPreds = keys.map(key => ({
      mood: key, 
      predict: predictions[key]
      })
    );
  
    console.log(arrayOfPreds);
  
    let highestPred = arrayOfPreds.reduce((prev, curr) => {
      return prev.predict > curr.predict ? prev : curr;
      });
  
    console.log(highestPred.id, highestPred.predict); 
  
  
    let orderedPred = arrayOfPreds.sort((a, b) => {
        return b.predict - a.predict;
    });
    
    console.log(orderedPred[0]);
    console.log(orderedPred[0].id);
    
    this.setState({
      predictions: orderedPred
    })
  
  

    this.predictData(message);
  }
      
  handleFiles = files => {
    let _files = files.base64;
    let base64Image = _files.replace("data:image/jpeg;base64,","");
    this.setState({ 
      imageData: _files
      });

    let message = {
      image: base64Image
    }
    
    scroll.scrollTo(600); 

    this.predictData(message);
  }

  predictData(message) {

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
        
        const keys = Object.keys(data.prediction);
        // projects data.prediction into an array of object key=prediction pairs
        const arrayOfPreds = keys.map(key => ({
          mood: key, 
          predict: data.prediction[key]
          })
        );
  
        let highestPred = arrayOfPreds.reduce((prev, curr) => {
          return prev.predict > curr.predict ? prev : curr;
          });
  
          console.log(highestPred.mood, highestPred.predict); 


          let orderedPred = arrayOfPreds.sort((a, b) => {
              return b.predict - a.predict;
          });
          
          console.log(orderedPred);
  
          
          this.setState({
            highestPredicted: highestPred,
            predictions: orderedPred
          })
  
    })
    .catch(error => {console.log(error)});
  }

    
  render() {
      const videoConstraints = {
          width: 1280,
          height: 720,
          facingMode: "user"
          };

      const {
          imageData,
          predictions,
          highestPredicted,
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

          </Col>
      
          <Col xl="4" className="pull-right margin-130">
              <Row> 
                <h1>Give it a go!</h1>
                <h3>Let SpotiFace recommend a playlist for<strong><em> you</em></strong>.</h3>
              </Row> 

              <Row className="container1-row">
                  <Button id="samplePopover1" className="container1-img-btn"><img className="container1-img" src={angry} alt="angry" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover1">
                  <PopoverHeader><h4>The Angry Wolverine</h4></PopoverHeader>
                  <PopoverBody>Here's how you do a proper angry face!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover2" className="container1-img-btn"><img className="container1-img" src={scared} alt="scared" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover2">
                  <PopoverHeader><h4>The Scared Chicken</h4></PopoverHeader>
                  <PopoverBody>AAAAAAAHHHHH!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover3" className="container1-img-btn"><img className="container1-img" src={happy} alt="happy" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover3">
                  <PopoverHeader><h4>The Beaming Smile</h4></PopoverHeader>
                  <PopoverBody>Say CHEEEESE!</PopoverBody>
                  </UncontrolledPopover>
              </Row>
              <Row className="container1-row">


                  <Button id="samplePopover4" className="container1-img-btn"><img className="container1-img" src={sad} alt="sad"></img> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover4">
                  <PopoverHeader><h4>The Heartbroken</h4></PopoverHeader>
                  <PopoverBody>We need genuine tears for this!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover5" className="container1-img-btn"><img className="container1-img" src={surprised} alt="surprised" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover5">
                  <PopoverHeader><h4>The Shocking News</h4></PopoverHeader>
                  <PopoverBody>Have you got any goss?</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover6" className="container1-img-btn"><img className="container1-img" src={neutral} alt="neutral" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover6">
                  <PopoverHeader><h4>The Chill Dude</h4></PopoverHeader>
                  <PopoverBody>Take a chill pill and relax!</PopoverBody>
                  </UncontrolledPopover>


                    {/*
                <FontAwesomeIcon className="emoji" size="2x" icon={faAngry}> </FontAwesomeIcon>
                <FontAwesomeIcon className="emoji" size="2x" icon={faFlushed}> </FontAwesomeIcon>
                <FontAwesomeIcon className="emoji" size="2x" icon={faSmileBeam}> </FontAwesomeIcon>
                <FontAwesomeIcon className="emoji" size="2x" icon={faSadTear}> </FontAwesomeIcon>
                <FontAwesomeIcon className="emoji" size="2x" icon={faSurprise}> </FontAwesomeIcon>
                <FontAwesomeIcon className="emoji" size="2x" icon={faMeh}> </FontAwesomeIcon> /**} */}
              </Row>
                    <br/>
              <Row className="container1-row">       
                <Button color="warning" size="lg" onClick={() => this.captureShot()}  className="camera-btn">
                 <FontAwesomeIcon size="lg" icon={faCamera}/> Take a photo
                </Button> 

                <ReactFileReader fileTypes={[".jpg",".jpeg", ".png", ".tiff", ".bmp"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
                  <Button color="warning" size="lg" className="react-file-reader-button"><FontAwesomeIcon size="lg" icon={faUpload}/> Upload</Button>
                </ReactFileReader>  
              </Row>

          </Col>
      </Row>
      </Container>
      </section>


      <Container2
        imageData={imageData} 
        predictions={predictions}
        highestPredicted={highestPredicted}/>

      <Preference highestPredicted={highestPredicted}/>

    </section>  
    );
  }

    
}
