import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './PantallaPrincipal/Login'
import EditarPropietario from './AdministracionPropietario/EditarPropietario'
import AltaPropietario from './AdministracionPropietario/AltaPropietario'
import InicioPropietario from './AdministracionPropietario/PrincipalPropietario'
import InicioAdministrador from './AdministracionAdministrador/InicioAdministrador';
import Perfil from "./Perfil/Perfil";
import AltaServicio from "./Servicio/GenerarServicio/AltaServicio"
import EditarServicio from './Servicio/GenerarServicio/EditarServicio'
import PrincipalCountry from './AdministracionCountry/PrincipalCountry';
import AltaCountry from './AdministracionCountry/AltaCountry';
import EditarCountry from './AdministracionCountry/EditarCountry';
import AltaAdministrador from './AdministracionAdministrador/AltaAdministrador';
import EditarAdministrador from './AdministracionAdministrador/EditarAdministrador'
import AltaEncargado from './AdministracionEncargadoIngresoEgreso/AltaEncargado';
import EditarEncargado from './AdministracionEncargadoIngresoEgreso/EditarEncargado'
import AltaInvitado from './AdministracionInvitados/AltaInvitado';
import EditarInvitado from './AdministracionInvitados/EditarInvitado'


    const Router = () => (
       <main>
           <Switch>
                <Route exact path='/' component={Login}/>
               <Route  path='/propietario' component={InicioPropietario}/>
               <Route path='/administrador' component={InicioAdministrador}/>
               <Route path='/perfil' component={Perfil}/>
               <Route path='/country' component={PrincipalCountry}/>
               <Route path='/altaCountry' component={AltaCountry}/>
               <Route path='/editarCountry/:id' component={EditarCountry}/>
               <Route path='/altaPropietario' component={AltaPropietario}/>
               <Route path='/editarPropietario/:id' component={EditarPropietario}/>
               <Route path='/altaAdministrador' component={AltaAdministrador}/>
               <Route path='/editarAdministrador/:id' component={EditarAdministrador}/>
               <Route path='/altaEncargado' component={AltaEncargado}/>
               <Route path='/editarEncargado/:id' component={EditarEncargado}/>
               <Route path='/altaServicio' component={AltaServicio}/>
               <Route path='/editarServicio/:id' component={EditarServicio}/>
               <Route path='/altaInvitado' component={AltaInvitado}/>
               <Route path='/editarInvitado/:id' component={EditarInvitado}/>

           </Switch>
       </main>
    )
export default Router
