import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Menu from "../../component/Menu";
import Cubes from "../../component/Cubes";
import Diamond from "../../component/Diamond";

import "./styled/index.css";

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
                <Route path="/3d/diamond" component={Diamond} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Main;
