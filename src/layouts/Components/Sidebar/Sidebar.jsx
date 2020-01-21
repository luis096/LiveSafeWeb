
import React, { Component } from "react";
// import Affix from "react-affixed";
import { NavLink } from "react-router-dom";
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import componentsRoutes from "routes/components.jsx";

var ps;

class Sidebar extends Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebarWrapper);
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

        <div className="fixed-section" ref="sidebarWrapper">
          <ul>
            {componentsRoutes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li key={key}>
                    <NavLink
                      to={prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      {prop.name}
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>
        </div>

    );
  }
}

// class AffixWrapper extends Component {
//   render() {
//     if (window.innerWidth > 991)
//       return <Affix  container={Sidebar} offsetTop={390}>{this.props.children}</Affix>;
//     return this.props.children;
//   }
// }

export default Sidebar;
