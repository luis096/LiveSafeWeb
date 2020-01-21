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
import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer footer-demo">
        <div className="container">
          <nav className="pull-left">
            <ul>
              <li>
                <a href="https://www.creative-tim.com/product/light-bootstrap-dashboard-pro?ref=lbdpr-docs-footer" target="_blank">
                  Light Bootstrap Dashboard Pro
                </a>
              </li>
              <li>
                <a href="https://www.creative-tim.com?ref=lbdpr-docs-footer" target="_blank">Creative Tim</a>
              </li>
              <li>
                <a href="http://blog.creative-tim.com?ref=lbdpr-docs-footer" target="_blank">Blog</a>
              </li>
            </ul>
          </nav>
          <div className="social-area pull-right">
            <a
              className="btn btn-social btn-twitter btn-simple"
              href="https://twitter.com/CreativeTim"
              target="_blank"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              className="btn btn-social btn-facebook btn-simple"
              href="https://www.facebook.com/CreativeTim"
              target="_blank"
            >
              <i className="fa fa-facebook-square" />
            </a>
            <a
              className="btn btn-social btn-google btn-simple"
              href="https://plus.google.com/+CreativetimPage"
              target="_blank"
            >
              <i className="fa fa-google-plus" />
            </a>
          </div>
          <div className="copyright">
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="https://www.creative-tim.com?ref=lbdpr-docs-footer" target="_blank">Creative Tim</a>, made with{" "}
            <i className="fa fa-heart heart" /> for a better web
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
