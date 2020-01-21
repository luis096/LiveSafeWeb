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
                barrios.push(
                    [doc.data(),doc.id]
                )
            });
        });
        this.setState({barrios});
        console.log(this.state.barrios)
    }

    actualizar(id){
        const {barrios}=this.state;
        this.state.barrios.map( valor => {
            if(valor[1]== id){
                barrios.splice(barrios.indexOf(valor),1)
            }
        })
        this.setState({barrios});
        this.render();
    }


    render(){
        return(
            <div className="content">
                <div className="form-group">
                    <div>
                        <label className="h2">Barrios registrados</label>
                    </div>
                    <div className='izquierda'>
                        <Link to='/root/altaCountry' type="button" className="btn btn-primary">Nuevo Country</Link>
                    </div>
                </div>

                <div className="card">
                    <div className='card-body' >

                        <br></br>

                        <table className="table table-hover  ">
                            <thead >
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Calle</th>
                                <th scope="col">Numero</th>
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
                </div>
            </div>
        );
    }
}

export default PrincipalCountry;