/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon
} from "react-share";
import Switch from "react-bootstrap-switch";

import imagine1 from "../../logoLiveSafe.png";
import imagine2 from "../../logoLiveSafe.png";
import imagine3 from "../../logoLiveSafe.png";
import imagine4 from "../../logoLiveSafe.png";

class FixedPlugin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: "dropdown show-dropdown open",
      bg_checked: true,
      bgImage: this.props.bgImage,
      switched: false,
      mini_checked: this.props.mini,
      navbar_checked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.onChangeClick = this.onChangeClick.bind(this);
    this.onNavbarClick = this.onNavbarClick.bind(this);
    this.onMiniClick = this.onMiniClick.bind(this);
  }
  handleClick() {
    this.props.handleFixedClick();
  }
  onChangeClick() {
    this.setState({ bg_checked: !this.state.bg_checked });
    this.props.handleHasImage(this.state.bg_checked);
  }
  onNavbarClick() {
    this.setState({ navbar_checked: !this.state.navbar_checked });
    this.props.handleNavbarClick(this.state.navbar_checked);
  }
  onMiniClick() {
    this.setState({ mini_checked: !this.state.mini_checked });
    this.props.handleMiniClick(this.state.mini_checked);
  }
  render() {
    return (
      <div className="fixed-plugin">
        <div id="fixedPluginClasses" className={this.props.fixedClasses}>
          <div onClick={this.handleClick}>
            <i className="fa fa-cog fa-2x" />
          </div>
          <ul className="dropdown-menu">
            <li className="header-title">Configuration</li>
            <li className="adjustments-line">
              <p className="pull-left">Background Image</p>
              <div className="pull-right">
                <Switch
                  onChange={this.onChangeClick}
                  defaultValue={this.state.bg_checked}
                />
              </div>
              <div className="clearfix" />
            </li>
            {window.location.pathname.indexOf("pages") > -1 ? (
              ""
            ) : (
              <li className="adjustments-line">
                <p className="pull-left">Sidebar Mini</p>
                <div className="pull-right">
                  <Switch
                    onChange={this.onMiniClick}
                    defaultValue={this.state.mini_checked}
                  />
                </div>
                <div className="clearfix" />
              </li>
            )}
            {window.location.pathname.indexOf("pages") > -1 ? (
              ""
            ) : (
              <li className="adjustments-line">
                <p className="pull-left">Fixed Navbar</p>
                <div className="pull-right">
                  <Switch
                    onChange={this.onNavbarClick}
                    defaultValue={this.state.navbar_checked}
                  />
                </div>
              </li>
            )}
            <li className="adjustments-line">
              <a className="switch-trigger">
                <p>Filters</p>
                <div className="pull-right">
                  <span
                    className={
                      this.props.bgColor === "black"
                        ? "badge filter active"
                        : "badge filter"
                    }
                    data-color="black"
                    onClick={() => {
                      this.props.handleColorClick("black");
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "azure"
                        ? "badge filter badge-azure active"
                        : "badge filter badge-azure"
                    }
                    data-color="azure"
                    onClick={() => {
                      this.props.handleColorClick("azure");
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "green"
                        ? "badge filter badge-green active"
                        : "badge filter badge-green"
                    }
                    data-color="green"
                    onClick={() => {
                      this.props.handleColorClick("green");
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "orange"
                        ? "badge filter badge-orange active"
                        : "badge filter badge-orange"
                    }
                    data-color="orange"
                    onClick={() => {
                      this.props.handleColorClick("orange");
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "red"
                        ? "badge filter badge-red active"
                        : "badge filter badge-red"
                    }
                    data-color="red"
                    onClick={() => {
                      this.props.handleColorClick("red");
                    }}
                  />
                  <span
                    className={
                      this.props.bgColor === "purple"
                        ? "badge filter badge-purple active"
                        : "badge filter badge-purple"
                    }
                    data-color="purple"
                    onClick={() => {
                      this.props.handleColorClick("purple");
                    }}
                  />
                </div>
                <div className="clearfix" />
              </a>
            </li>
            <li className="header-title">Sidebar Images</li>
            <li className={this.state["bgImage"] === imagine1 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine1 });
                  this.props.handleImageClick(imagine1);
                }}
              >
                <img src={imagine1} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine2 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine2 });
                  this.props.handleImageClick(imagine2);
                }}
              >
                <img src={imagine2} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine3 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine3 });
                  this.props.handleImageClick(imagine3);
                }}
              >
                <img src={imagine3} alt="..." />
              </a>
            </li>
            <li className={this.state["bgImage"] === imagine4 ? "active" : ""}>
              <a
                className="img-holder switch-trigger"
                onClick={() => {
                  this.setState({ bgImage: imagine4 });
                  this.props.handleImageClick(imagine4);
                }}
              >
                <img src={imagine4} alt="..." />
              </a>
            </li>

            <li className="button-container">
              <div className="">
                {
                  // eslint-disable-next-line
                }
                <a
                  href="https://www.creative-tim.com/product/light-bootstrap-dashboard-react?ref=lbdpr-fixed-plugin"
                  target="_blank"
                  className="btn btn-success btn-block btn-fill"
                >
                  Download free!
                </a>
              </div>
            </li>
            <li className="button-container">
              <div className="">
                {
                  // eslint-disable-next-line
                }
                <a
                  href="https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react?ref=lbdpr-fixed-plugin"
                  target="_blank"
                  className="btn btn-warning btn-block btn-fill"
                >
                  Buy Pro
                </a>
              </div>
            </li>
            <li className="button-container">
              <NavLink
                to={"/documentation"}
                className="btn btn-fill btn-info"
                activeClassName="active"
              >
                Documentation
              </NavLink>
            </li>

            <li className="header-title" id="sharrreTitle">
              Thank you for sharing!
            </li>

            <li className="button-container">
              <FacebookShareButton url="https://timcreative.github.io/light-bootstrap-dashboard-pro-react">
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TwitterShareButton
                url="https://timcreative.github.io/light-bootstrap-dashboard-pro-react"
                title="Light Bootstrap Dashboard PRO React - Premium Bootstrap Admin Template"
                hashtags={[
                  "react",
                  "reactbootstrap",
                  "bootstrap",
                  "creativetim"
                ]}
                via="creativetim"
              >
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FixedPlugin;
