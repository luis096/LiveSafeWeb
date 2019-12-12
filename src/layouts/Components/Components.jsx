
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Switch, Route, Redirect } from "react-router-dom";
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "codemirror/lib/codemirror.css";

import Sidebar from "./Sidebar/Sidebar.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

import docRoutes from "documentation.js";

import "../../assets/css/Components.css"; 

var ps;

class Components extends Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.componentsPanel);
    }
  }
  componentDidUpdate() {
    if (navigator.platform.indexOf("Win") > -1) {
      setTimeout(() => {
        ps.update();
      }, 350);
    }
  }
  render() {
    return (
      <div className="components" ref="componentsPanel">
        <Header />
        <div className="wrapper">
          <div className="main">
            <div className="section">
              <Grid>
                <Row>
                  <Col md={2}>
                    <Sidebar />
                  </Col>
                  <Col md={8} mdOffset={1}>
                    <div className="space-top" />
                    <div className="components-panel">
                      <Switch>
                        {docRoutes.map((prop, key) => {
                          if (prop.redirect)
                            return (
                              <Redirect
                                from={prop.path}
                                to={prop.pathTo}
                                key={key}
                              />
                            );
                          return (
                            <Route
                              path={prop.path}
                              component={prop.component}
                              key={key}
                            />
                          );
                        })}
                      </Switch>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Components;
