import React, { Component } from 'react';
import "../Style/Alta.css"
import PrincipalInvitados from '../AdministracionInvitados/PrincipalInvitados';

class InicioPropietario extends Component{

    constructor(props) {
        super(props);
    }
        
    render(){
        return(
            <div className="app container-fluid ">
                <PrincipalInvitados></PrincipalInvitados>
            </div>

    )}
}

export default InicioPropietario;