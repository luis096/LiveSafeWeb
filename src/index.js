import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import AdminLayout from "layouts/Admin.jsx";
import RootLayout from "layouts/Root.jsx";
import EncargadoLayout from "layouts/Encargado.jsx";
import PropietarioLayout from "layouts/Propietario.jsx";
import Invitado from "layouts/Invitado-Evento.jsx";
import Login from "layouts/Login.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/root" render={props => <RootLayout {...props} />} />
      <Route path="/propietario" render={props => <PropietarioLayout {...props} />} />
      <Route path="/encargado" render={props => <EncargadoLayout {...props} />} />
      <Route path="/invitado" render={props => <Invitado {...props} />} />
      <Route path="/login" render={props => <Login {...props} />} />
      <Redirect from="/" to="/login" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
