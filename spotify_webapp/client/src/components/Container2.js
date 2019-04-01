import React, { Component } from 'react';
import '../App.css';
import { Container, Row, Col, Button, Fade } from 'reactstrap';


export default class Container2 extends Component {

    render() {
        const {
            imageData,
            predictions,
            highestPredicted
        } = this.props;
    return(
        <section id="container2">
        <Container fluid>
        <Row className="row">
            <Col sm="5" className="pull-left text-left margin-100">
    { /*  
                <div>{mood.map((item) => (<div>{item.desc + ' ' + item.expense}</div>))}</div>    */ } 
           { predictions[0] ? 
            <section >
                <Fade>
                <h2 id="highest-pred"> Your current mood is: {highestPredicted.mood} </h2>
                <br/>
                {predictions.map((pred) => {
                    return <div key={pred.mood}>
                    <p className="predictions">{pred.mood}: {pred.predict}</p>
                    </div>
                })}

                </Fade> 

            <Button outline className="btn-secondary" size="lg" id="repeat-btn" href="#container1"> One more time?</Button>
            </section>  :  null
             }


            </Col>
        
            <Col xl="6" className="margin-50_lesstop">

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

