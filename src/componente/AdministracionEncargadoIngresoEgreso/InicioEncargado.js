import React, { Component } from 'react';
import "../Style/Alta.css"
import PrincialIngreso from '../Ingresos/PrincipalIngreso';
import PrincialEgreso from '../Egresos/PrincipalEgreso'



class InicioAdministrador extends Component{

    constructor(props) {
        super(props);
    }
        

    render(){
        return(
            <div className="app container-fluid ">
                <PrincialIngreso></PrincialIngreso>
                <PrincialEgreso></PrincialEgreso>
            </div>

    )}
}

export default InicioAdministrador;