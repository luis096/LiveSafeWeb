import React, { Component } from 'react';
import {Database} from '../../config/config';
import "../Style/Alta.css";
import { Link } from 'react-router-dom'
import Country from './Country';


class PrincipalCountry extends Component{

    constructor(){
        super();
        this.state= {
            barrios: []
        }
        this.actualizar = this.actualizar.bind(this)
    }

    async componentDidMount(){
        const { barrios } = this.state;
        await Database.collection('Country').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.barrios.push(
                    [doc.data(),doc.id]
                )
            });
        });
        this.setState({barrios});
    }

    render(){
        return(          
            <div className="col-12">
             <div className="row ">
                 <div className="col-1"></div>
                    <div className="col-5">
                    <label className="h2">Country</label>
                    </div>                
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>     
                        <Link to='/altaCountry' type="button" className="btn btn-primary" type="submit" >Nuevo Country</Link>
                    </div>
             </div>
                   
            <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10 ">
            
            <br></br>

            <table className="table table-hover  ">
                <thead >
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Calle</th>
                    <th scope="col">Calle</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    </tr>
                </thead>
                
                <tbody>
                    { 
                        
                        this.state.barrios.map( barrio => {
                            return(
                                
                                <Country
                                idCountry = {barrio[1]}
                                nombre = {barrio[0].Nombre}
                                calle = {barrio[0].Calle}
                                numero = {barrio[0].Numero}
                                titular = {barrio[0].Titular}
                                celular = {barrio[0].Celular}
                                act = {this.actualizar}
                                >
                                </Country>
                            )
                        }

                        )
                    }

                </tbody>
            </table>
            </div>
            <div className="col-md-1"></div>            
            </div>
            <div>  
            < hr className="my-4"></hr>
            </div>
            <div className="espacio"></div>            
    </div>
    );
    }
}

export default PrincipalCountry;