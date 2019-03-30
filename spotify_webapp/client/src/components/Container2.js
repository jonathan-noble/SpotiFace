import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, Button, Fade } from 'reactstrap';


export default class Container2 extends Component {

    render() {
        const {
            imageData,
            mood,
            highestPredicted
        } = this.props;
    return(
        <section id="container2">
        <Container fluid>
        <Row className="row">
            <Col sm="3" className="pull-left text-left margin-100">
    { /*  
                <div>{mood.map((item) => (<div>{item.desc + ' ' + item.expense}</div>))}</div>    */ } 
            <Button outline size="lg" className="btn-secondary" href="#container1" >One more time?</Button>
            
                { mood.angry ?
                <Fade>
                <ol> </ol>
                <h2> Your current mood is: {highestPredicted.id} </h2> <br/>
                <p>angry: {mood.angry} </p>
                <p>scared:   {mood.scared} </p>
                <p>happy:    {mood.happy}</p>
                <p>sad:     {mood.sad}</p>
                <p>surprised:  {mood.surprised}</p>
                <p>neutral:   {mood.neutral}</p>  
                </Fade>  : null
            }

            </Col>
        
            <Col xl="7" className="margin-150_lesstop">

            {imageData ? 
                <Fade> <p><img className="container2-img img-responsive pull-right round15" src={imageData} alt="Snapshot"/></p> </Fade>
                : null}

            </Col>          
        </Row>
        </Container>
        </section>
     );
    }
}

