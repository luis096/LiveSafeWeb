import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import Icons from "../../views/Icons.jsx";
import { Firebase } from '../../config/config';
import { Redirect } from "react-router-dom";


class AdminNavbarLinks extends Component {

  constructor(){
    super();
    this.state={
      redirect: false
    }
    this.logout = this.logout.bind(this);
  }

  setRedirect = () => {
    Firebase.auth().signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('mail');
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }
  }

  logout() {
    Firebase.auth().signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('mail');
  }

  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">5</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    
    return (
      <div>  
        {/* <Nav>
          <NavItem eventKey={1} href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
          <NavDropdown
            eventKey={2}
            title={notification}
            noCaret
            id="basic-nav-dropdown"
          >
            <MenuItem eventKey={2.1}>Notification 1</MenuItem>
            <MenuItem eventKey={2.2}>Notification 2</MenuItem>
            <MenuItem eventKey={2.3}>Notification 3</MenuItem>
            <MenuItem eventKey={2.4}>Notification 4</MenuItem>
            <MenuItem eventKey={2.5}>Another notifications</MenuItem>
          </NavDropdown>
          <NavItem eventKey={3} href="#">
            <i className="fa fa-search" />
            <p className="hidden-lg hidden-md">Search</p>
          </NavItem>
        </Nav> */}
        <Nav pullRight>
          {/* <NavItem eventKey={1} href="#">
            Account
          </NavItem> */}
          
          <NavDropdown
            eventKey={2}
            title={localStorage.getItem('mail')}
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1}>Opcion</MenuItem>
            <MenuItem eventKey={2.2}>Opcion</MenuItem>  
            <MenuItem divider />
            {this.renderRedirect()}
            <MenuItem onClick={this.setRedirect}>Log out</MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
