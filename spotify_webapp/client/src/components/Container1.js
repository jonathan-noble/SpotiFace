import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, 
        Button} from 'reactstrap';
import { faCamera, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Webcam from 'react-webcam'; 
import ReactFileReader from 'react-file-reader';
import Container2 from './Container2';
import Preference from './Preference';


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

            </Col>
        
            <Col xl="4" className="pull-right margin-150">
                <h1>Give it a go!</h1>
                <h3>Let SpotiFace recommend a playlist for<strong><em> you</em></strong>.</h3>

                <Row>
                  <Button color="primary" size="lg" onClick={this.captureShot} className="camera-btn" href="#container2" ><FontAwesomeIcon size="lg" icon={faCamera}/> Take a photo</Button>  

                  <ReactFileReader fileTypes={[".jpg",".jpeg", ".png", ".tiff", ".bmp"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
                    <Button color="primary" size="lg" className="react-file-reader-button" href="#container2"><FontAwesomeIcon size="lg" icon={faUpload}/> Upload</Button>
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
