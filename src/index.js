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



import AdminLayout from 'layouts/Admin.jsx';
import LoginLayout from 'views/Pages/LoginPage.jsx'

import Inicio from 'componente/Inicio'

import Invitado from 'componente/InvitadoEvento/InvitadoEvento.js';
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
            <Route path="/login" render={props=><LoginLayout {...props} />}/>
            <Route path="/inicio" render={props=><Inicio {...props} />}/>
            <Route path="/admin" render={props=><AdminLayout {...props} />}/>
            <Route path="/root" render={props=><AdminLayout {...props} />}/>
            <Route path="/encargado" render={props=><AdminLayout {...props} />}/>
            <Route path="/propietario" render={props=><AdminLayout {...props} />}/>
            <Route path="/invitado/:id" render={props=><Invitado {...props} />}/>
            <Redirect from="/" to="/inicio"/>
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);
