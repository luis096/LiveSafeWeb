import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/sass/light-bootstrap-dashboard-pro-react.scss?v=1.2.0';
import 'assets/css/demo.css';
import 'assets/css/pe-icon-7-stroke.css';

import AuthLayout from 'layouts/Auth.jsx';
// import AdminLayout from "layouts/Admin.jsx";
import LoginLayout from 'layouts/Login.jsx';
import DocumentationLayout from 'layouts/Components/Components.jsx';

import AdminLayout from 'layouts/Admin.jsx';
import RootLayout from 'layouts/Root.jsx';
import EncargadoLayout from 'layouts/Encargado.jsx';
import PropietarioLayout from 'layouts/Propietario.jsx';
import Invitado from 'layouts/Invitado-Evento.jsx';
import Login from 'layouts/Login.jsx';

const hist = createBrowserHistory();

ReactPixel.init('111649226022273');
ReactPixel.pageView();
ReactPixel.fbq('track', 'PageView');

ReactGA.initialize('UA-46172202-11');
ReactGA.set({page: window.location.pathname + window.location.search});
ReactGA.pageview(window.location.pathname + window.location.search);

hist.listen(location=> {
    ReactGA.set({page: window.location.pathname + window.location.search});
    ReactGA.pageview(window.location.pathname + window.location.search);

    ReactPixel.pageView();
    ReactPixel.fbq('track', 'PageView');
});
ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/login" render={props=><AuthLayout {...props} />}/>
            <Route path="/admin" render={props=><AdminLayout {...props} />}/>
            <Route path="/root" render={props=><AdminLayout {...props} />}/>
            <Route path="/d" render={props=><Login {...props} />}/>
            <Redirect from="/" to="/login"/>
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
