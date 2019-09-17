import React, { Component } from 'react';
import "../../Style/Alta.css";
import {Database} from "../../../config/config"
import {Link} from 'react-router-dom'

class AltaServicio extends Component{

    constructor(){
        super();
        this.state = {
            nombre: '',
            estado: 'Si',
            disponibilidad: '',
            descripcion: '',
            dias : ['','','','','','',''],
        }
        this.addServicio= this.addServicio.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeRadio  = this.ChangeRadio.bind(this);
        this.registrar = this.registrar.bind(this);

    }


    addServicio(){
        Database.collection('Country').doc(localStorage.getItem('idCountry')).collection('Servicios').add({
            Nombre: this.state.nombre,
            Estado: this.state.estado=== 'Si'?true:false,
            Disponibilidad: this.state.dias,
            Descripcion: this.state.descripcion,
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeRadio(event){
      this.setState({estado: event.currentTarget.value})
  }
    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addServicio();
        }
    }


    ChangeDiasDisponible(event){
        let checkedArray = this.state.dias;
        let selectedValue = event.target.value;
        let id = event.target.id;
        if (event.target.checked === true) {

            checkedArray[id]=selectedValue;
            this.setState({
                dias: checkedArray
            });

        } else {

            checkedArray[id]='';

            this.setState({
                dias: checkedArray
            });

        }
    }

    render(){

        return(
            <div className="col-12 ">
                <div className="row">
                <legend><h1>  Registrar Alta</h1> </legend>
                    <div className = "col-md-6  flex-container form-group">
                        <label for = "NombreServicio"> Nombre del Servicio  </label>
                        <input  type = "name" className = "form-control"  
                         placeholder = "Name Service"
                         value={this.state.nombre}
                         onChange={this.ChangeNombre}/>
                    </div>
                    <div className = "col-md-6 flex-container form-group">
                        <label for = "FechaNacimiento">  Dias disponibles  </label>
                        <div >
                         <label><input  id='0' value="Lun" type="checkbox" checked={this.state.dias[0] === 'Lun'} onChange={this.ChangeDiasDisponible.bind(this)} />Lun </label>
                            <label><input id='1' value="Mar" type="checkbox" checked={this.state.dias[1] === 'Mar'} onChange={this.ChangeDiasDisponible.bind(this)} />Mar </label>
                        <label><input id='2' value="Mie" type="checkbox" checked={this.state.dias[2] === 'Mie'} onChange={this.ChangeDiasDisponible.bind(this)} />Mie </label>
                        <label><input id='3' value="Jue" type="checkbox" checked={this.state.dias[3] === 'Jue'} onChange={this.ChangeDiasDisponible.bind(this)} />Jue </label>
                        <label><input id='4' value="Vie" type="checkbox" checked={this.state.dias[4] === 'Vie'} onChange={this.ChangeDiasDisponible.bind(this)} />Vie </label>
                        <label><input id='5' value="Sab" type="checkbox" checked={this.state.dias[5] === 'Sab'} onChange={this.ChangeDiasDisponible.bind(this)} />Sab </label>
                        <label><input id='6' value="Dom" type="checkbox" checked={this.state.dias[6] === 'Dom'} onChange={this.ChangeDiasDisponible.bind(this)} />Dom </label>
                        </div>
                    </div>
                    <fieldset className = "col-md-6 flex-container form-group">
                            <legend>  Estado  </legend>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input"  
                                    value = 'Si' checked={this.state.estado === 'Si'}
                                    onChange={this.ChangeRadio} />
                                        Disponibile
                                    </label>
                                </div>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" value = 'No'
                                    onChange={this.ChangeRadio} checked={this.state.estado === 'No'} />
                                            No Disponibile
                                    </label>
                                </div>
                        </fieldset>
                    <div className = "col-md-6 flex-container form-group">
                        <label for = "exampleTextarea"> Descripcion  </ label >
                        <textarea className = "form-control" id = "exampleTextarea" rows = "3"
                         value={this.state.descripcion}
                         onChange={this.ChangeDescripcion}> </textarea>
                    </div>
                </div>
            
            <div className="form-group izquierda">
                <button className="btn btn-primary boton" onClick={this.registrar}>Registrar</button>                  
                <Link to="/" type="button" className="btn btn-primary boton"
                >Volver</Link> 
            </div>
        </div>
        );
    }
}
export default AltaServicio;