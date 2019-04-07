import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, 
        UncontrolledAlert,
        Button, UncontrolledPopover, PopoverBody
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
          activatePredictError: false,
      }
  }

    
  captureShot = () => {
    const screenshot = this.webcam.getScreenshot();

    if(screenshot) {
    let base64Image = screenshot.replace("data:image/jpeg;base64,","");
    this.setState({ 
      imageData: screenshot
      });
    
    let message = {
      image: base64Image
    }

    scroll.scrollTo(850); 
    
    this.predictData(message);

   } else {
     console.log("Turn on your camera.")
   }
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
        if((response.ok===false) || (response.status===500)) {
          this.setState({
            activatePredictError: true
          })
        }  else { 
          this.setState({
            activatePredictError: false
          })
            return response.json();  //response.json() is resolving its promise. It waits for the body to load
          }
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
    .catch(error => { console.log(error) });
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
          activatePredictError,
      } = this.state;

  return(
    <section>
      <section id="container1"> 
      <Container fluid>
      <Row className="row">
          <Col xl="7" className="margin-100">    
                <Webcam
                className="webcam-bg round15"
                audio={false}
                ref={node => this.webcam = node}
                screenshotFormat="image/jpeg"
                width={700}
                height={500}
                videoConstraints={videoConstraints}
                /> 

                <section id="pred-error"> 
                { activatePredictError ?
                  <section> 
                  <h2>No Face Detected! </h2>
                  <p>Possible factors such as no available face detected, blurriness, intense brightness </p> 
                  <p> or low brightness may have tampered the input. </p>
                  </section>
                  : null }
                </section>  
          </Col>
      
          <Col xl="4" className="pull-right margin-100_right">
              <Row> 
                <h1>Give it a go!</h1>
                <h3>Let SpotiFace recommend a playlist for<strong><em> you</em></strong>.</h3>
              </Row> 

              <Row>
                  <Button id="samplePopover1" className="container1-img-btn"><img className="container1-img" src={angry} alt="angry" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover1">
                  <PopoverBody>Here's how you do a proper angry face!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover2" className="container1-img-btn"><img className="container1-img" src={scared} alt="scared" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover2">
                  <PopoverBody>AAAAAAAAAAAHHHHHHHHH!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover3" className="container1-img-btn"><img className="container1-img" src={happy} alt="happy" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover3">
                  <PopoverBody>Say CHEEEEEEEEESE!</PopoverBody>
                  </UncontrolledPopover>
              </Row>
              <Row>
                  <Button id="samplePopover4" className="container1-img-btn"><img className="container1-img" src={sad} alt="sad"></img> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover4">
                  <PopoverBody>We need genuine tears for this one!</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover5" className="container1-img-btn"><img className="container1-img" src={surprised} alt="surprised" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover5">
                  <PopoverBody>Have you got any goss?</PopoverBody>
                  </UncontrolledPopover>

                  <Button id="samplePopover6" className="container1-img-btn"><img className="container1-img" src={neutral} alt="neutral" /> </Button>
                  <UncontrolledPopover placement="left" trigger="focus" target="samplePopover6">
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
              <Row>      
                <Button outline color="secondary" className="camera-btn" size="lg" onClick={() => this.captureShot()}>
                 <FontAwesomeIcon size="lg" icon={faCamera}/> Take a photo
                </Button> 

                <ReactFileReader fileTypes={[".jpg",".jpeg", ".png", ".tiff", ".bmp"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
                  <Button outline color="secondary" size="lg" className="reader-btn"><FontAwesomeIcon size="lg" icon={faUpload}/> Upload</Button>
                </ReactFileReader>  
              </Row>

              <br/>
              <UncontrolledAlert color="info" style={{marginLeft: -10}}>
              Try acting one of the faces below!
             </UncontrolledAlert> 
          </Col>
      </Row>
      </Container>
      </section>

      {  !activatePredictError && predictions[0] ? 
        <Container2
          imageData={imageData} 
          predictions={predictions}
          highestPredicted={highestPredicted}
          activatePredictError={activatePredictError}/>
          : null 
        }

        <Preference
        highestPredicted={highestPredicted}
        predictions={predictions}
        activatePredictError={activatePredictError}
        />


    </section>  
    );
  }
 
}
