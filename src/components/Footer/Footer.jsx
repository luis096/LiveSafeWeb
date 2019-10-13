import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#company">Aguero</a>
              </li>
              <li>
                <a href="#portafolio">Messi</a>
              </li>
              <li>
                <a href="#blog">Higuain</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
          
              Live Safe, el mejor sitio para tu barrio cerrado.
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
