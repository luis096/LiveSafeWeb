import React, { Component } from 'react';
import "../Style/Alta.css";
import PrincipalCountry from '../AdministracionCountry/PrincipalCountry'
import PrincipalAdministrador from '../AdministracionAdministrador/PrincipalAdministrador'



class InicioRoot extends Component{

    constructor(props) {
        super(props);
        this.state = { 
                        propietariosList: [ ]
                    };
    }
       
    render(){

        return(
        <div className="app container-fluid ">
                <PrincipalCountry></PrincipalCountry>
                {/*<PrincipalAdministrador></PrincipalAdministrador>*/}
                </div>
    );
    }
}

export default InicioRoot;