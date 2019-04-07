import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col,
        Progress, Button, Fade } from 'reactstrap';
import { animateScroll as scroll } from 'react-scroll'
// import { faAngry, faFlushed, faSmileBeam, faSurprise, faSadTear } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default class Container2 extends Component {

    scrollToTop() {
        scroll.scrollTo(0); 
    }

    render() {
        const {
            imageData,
            predictions,
            highestPredicted,
            activatePredictError,
        } = this.props;
    return(
        
        <section id="container2">
        <Container fluid>
        <Row className="row">
            <Col sm="5" className="pull-left text-left margin-10_bot">


           { !activatePredictError && predictions[0]  ? 
            <section >
            <Fade>
            <h2 id="highest-predictions"> Your current mood is: {highestPredicted.mood} </h2>
            <hr className="my-2" />

                <div className="predictions">{predictions[0].mood}</div>
                <Progress bar color="success" value={predictions[0].predict} animated><h5>{predictions[0].predict}%</h5></Progress>

                <div className="predictions">{predictions[1].mood}</div>
                <Progress bar className="prediction-p" color="info" value={predictions[1].predict}><h5>{predictions[1].predict}%</h5></Progress>

                <div className="predictions">{predictions[2].mood}</div>
                <Progress bar className="prediction-p" color="info" value={predictions[2].predict}><h5>{predictions[2].predict}%</h5></Progress>

                <div className="predictions">{predictions[3].mood}</div>
                <Progress bar className="prediction-p" color="info" value={predictions[3].predict}><h5>{predictions[3].predict}%</h5></Progress>

                <div className="predictions">{predictions[4].mood}</div>
                <Progress bar className="prediction-p" color="info" value={predictions[4].predict}><h5>{predictions[4].predict}%</h5></Progress>

                <div className="predictions">{predictions[5].mood}</div>
                <Progress bar className="prediction-p" color="danger" value={predictions[5].predict}><h5>{predictions[5].predict}%</h5></Progress>
            <hr className="my-2" />
            <Button outline size="lg" color="secondary" className="container3-btn" onClick={this.scrollToTop}> One more time?</Button>
            </Fade> 
            </section>:  null
             }


            </Col>
        
            <Col xl="6">
            {imageData ? 
                <Fade> <p><img className="container2-img img-responsive pull-right round15" src={imageData} alt="Snapshot"/></p> </Fade>
                :  null
                }

            </Col>          
        </Row>
        </Container>
        </section>
     );
    }
}

