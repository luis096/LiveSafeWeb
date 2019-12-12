import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

import AdminNavbarLinks from "./AdminNavbarLinks.jsx";

class NavbarDemo extends Component {
  render() {
    return (
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#pablo">Brand</a>
          </Navbar.Brand>
        </Navbar.Header>
        <AdminNavbarLinks />
      </Navbar>
    );
  }
}

export default NavbarDemo;
