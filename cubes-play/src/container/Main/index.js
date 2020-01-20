import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Menu from "../../component/Menu";
import Cubes from "../../component/Cubes";

class Main extends Component {
  render() {
    return (
      <div className="play-app-container">
        <Container fluid={true}>
          <Row>
            <Col sm={3}>
              <Menu />
            </Col>
            <Col sm={9}>
              <Switch>
                <Route exact path="/" render={() => <h1>Home</h1>} />
                <Route path="/3d/pyramid" component={Cubes} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Main;
