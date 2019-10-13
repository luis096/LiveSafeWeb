/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { NavDropdown, MenuItem, Dropdown} from 'react-bootstrap'
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";


import logo from "../../logoLiveSafe.png";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + this.props.image + ")"
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color={this.props.color}
        data-image={this.props.image}
      >
          {this.props.hasImage ? (
            <div className="sidebar-background" style={sidebarBackground} />
          ) : (
            null
          )}
        <div className="logo">
          <a
            href="#"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a
            href="#"
            className="simple-text logo-normal"
          >
           Live Safe
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
            
            {this.props.routes.map((prop, key) => {
              let name = prop.icon;
              let nameTwo = '#' + prop.icon;
              if (!prop.redirect)
                return (
                  <li
                    className={
                      prop.upgrade
                        ? "active active-pro"
                        : this.activeRoute(prop.layout + prop.path)
                    }
                    key={key}
                    id={name}
                  >
                  {/* <div>
                    <i className={prop.icon}/>
                    <p>{prop.name}</p>
                  </div>
                    
    <UncontrolledCollapse toggler={nameTwo}>
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
    </UncontrolledCollapse></li> */}
                  {/* // <li
                  //   className={
                  //     prop.upgrade
                  //       ? "active active-pro"
                  //       : this.activeRoute(prop.layout + prop.path)
                  //   }
                  //   key={key}
                  // > */}
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  
                  </li>


                //   <Dropdown
                //   className={
                //     prop.upgrade
                //       ? "active active-pro"
                //       : this.activeRoute(prop.layout + prop.path)
                //   }
                //   key={key}
                //   eventKey={2}
                //   title="Dropdown"
                //   id="basic-nav-dropdown-right"
                // >
                //   <MenuItem eventKey={2.1}><NavLink
                //       to={prop.layout + prop.path}
                //       className="nav-link"
                //       activeClassName="active"
                //     >
                //       <i className={prop.icon} />
                //       <p>{prop.name}</p>
                //     </NavLink></MenuItem>
                //   <MenuItem eventKey={2.2}>Another action</MenuItem>
                //   <MenuItem divider />
                //   <MenuItem eventKey={2.5}>Separated link</MenuItem>
                // </Dropdown>
                );
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
