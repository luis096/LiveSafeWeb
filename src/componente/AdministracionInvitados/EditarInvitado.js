import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Database} from "../../config/config";
import {Link} from "react-router-dom"
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';


class EditarInvitado extends Component{

    constructor(props){
        super(props);
        this.state = {
            invitado: [],
            grupo: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            estado: '',
            descripcion: '',
            fechaNacimiento: '',
            idCountry:'',
            idPropietario: '',
            startDate:'', // Today
            endDate:'' , // Today + 6 days,
            tipoD: [],// Para cargar el combo
            resultado: ''
        }
        this.valor = (localStorage.getItem('tipoUsuario') == 'Propietario')?
        localStorage.getItem('idPersona'):localStorage.getItem('propietarioId')
        this.esPropietario = localStorage.getItem('tipoUsuario')==='Propietario'?true:false;
        this.editInvitado = this.editInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento= this.ChangeDocumento.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo  = this.ChangeGrupo.bind(this);
        this.ChangeFechas = this.ChangeFechas.bind(this);
        this.ChangeFechaDesde = this.ChangeFechaDesde.bind(this);
        this.ChangeFechaHasta = this.ChangeFechaHasta.bind(this);
        this.registrar = this.registrar.bind(this);
        
        const url = this.props.location.pathname.split('/');
        this.idInvitado  =  url[url.length - 1];
    }

    async componentDidMount(){
        const { tipoD, invitado} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )
            });
        });
        
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(this.valor)
        .collection('Invitados').doc(this.idInvitado).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.invitado.push(doc.data());
                } else {
                
                }
            })
            .catch(err => {
                //En caso de error, hacer esto...
            })
        this.setState({tipoD});
        this.setState({invitado});
        const estrella = this.state.invitado[0];
        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc => {
                if (doc.exists) {
                   this.state.tipoDocumento = {value : doc.id, label : doc.data().Nombre}
                }
            })
    
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            estado: estrella.Estado,
            documento: estrella.Documento,
            grupo: estrella.Grupo,
            fechaNacimiento: estrella.FechaNacimiento,
            fechaAlta:estrella.FechaAlta,
            startDate:estrella.FechaDesde,
            endDate: estrella.FechaHasta,

        })
    }

   editInvitado(){

            Database.collection('Country').doc(localStorage.getItem('idCountry'))
            .collection('Propietarios').doc(this.valor)
            .collection('Invitados').doc(this.idInvitado).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Estado: this.state.estado,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            Grupo: this.state.grupo,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: this.state.fechaAlta,
            FechaDesde: this.state.startDate,
            FechaHasta: this.state.endDate,
        });

    }

    
    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    
    ChangeFechas = (startDate, endDate) => this.setState({ startDate, endDate })


    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }

    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }
    ChangeGrupo(event) {
        this.setState({grupo : event.target.value});
    }
  
    ChangeFechaDesde(event){
        this.setState({startDate : event.target.value});
    }
    ChangeFechaHasta(event){
        this.setState({endDate : event.target.value});
    }

    registrarIngreso(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Ingresos').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            Hora: new Date(),
            Egreso: false,
            Estado: this.state.estado,
            Descripcion: '',
            IdEncargado: Database.doc('Country/'+ localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
        });  
    }

    registrarEgreso(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Egresos').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            Hora: new Date(),
            Egreso: true,
            Estado: this.state.estado,
            Descripcion: '',
            IdEncargado: Database.doc('Country/'+ localStorage.getItem('idCountry') + '/Encargados/' + localStorage.getItem('idPersona'))
        });  
    }

    async registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        
        if(true){
            await this.editInvitado();
            if (localStorage.getItem('tipoUsuario') === 'Encargado' && localStorage.getItem('editarInvitado')==='Ingreso'){
                this.registrarIngreso()
            } else if(localStorage.getItem('tipoUsuario') === 'Encargado' && localStorage.getItem('editarInvitado')==='Egreso'){
                this.registrarEgreso()

        }
    }
}


    render(){
        return(
            <ValidatorForm
            ref="form"
            onError={errors => console.log("hola",errors)}
            onSubmit={this.registrar}
            >
            <div className="col-md-12">
            <div>
                <div className="row">

                   <legend>Editar Invitado</legend>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "name" className = "form-control"   
                            label = "Grupo"
                            value = {this.state.grupo}
                            onChange={this.ChangeGrupo}
                            disabled={!this.esPropietario}
                            />
                        </div>
                        
                        <div className = "col-md-3  flex-container form-group " >
                            <label >  Fecha Desde (*)   </label>
                           <TextValidator type="date"className = "form-control" name="FechaDesde"
                         step="1" min="1920-01-01" value={this.state.startDate}
                         validators={["required"]}
					    errorMessages={["Campo requerido"]}
                         onChange={this.ChangeFechaDesde}
                         disabled={!this.esPropietario}
                        />
                        </div>
                        <div className = "col-md-3  flex-container form-group " >
                        <label >  Fecha Hasta (*)  </label>
                        <TextValidator type="date"className = "form-control" name="FechaHasta"
                            step="1" min="1920-01-01" value={this.state.endDate}
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            disabled={!this.esPropietario}
                            onChange={this.ChangeFechaHasta}
                             />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "name" className = "form-control"   
                                label = "Nombre (*)"
                                value = {this.state.nombre}
                                validators={["required"]}
                                errorMessages={["Campo requerido"]}
                                onChange={this.ChangeNombre}
                                disabled={this.esPropietario}
                            />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "family-name" className = "form-control"   
                                label = "Apellido (*)"
                                   value = {this.state.apellido}
                                   validators={["required"]}
					            	errorMessages={["Campo requerido"]}
                                   onChange= {this.ChangeApellido} 
                                   disabled={this.esPropietario}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                        <SelectValidator
                            label="Tipo Documento (*)"
                            // validators={["required"]}
                            // errorMessages={["Campo requerido"]}
                            id = 'documento'
                                // className="select-documento"
                                // classNamePrefix="select"
                                // defaultValue={this.state.tipoD[0]}
                                // isDisabled={false}
                                // isLoading={false}
                                // isClearable={true}
                                // isSearchable={true}
                                name="tipoD"
                                //value={this.state.tipoD}
                                
                                SelectProps={{
                                    native: true
                                }}
                                onChange={this.ChangeSelect.bind(this)}
                            >
                                                                <option value=""></option>

                            {this.state.tipoD.map(tipos =>{
                                return(
                                    <option key={tipos.value} value={tipos.value}>
                                        {tipos.name}
                                    </option>
                                );
                            })}
                    </SelectValidator>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "document" className = "form-control"   
                            label = "Numero de Documento (*)"
                            value = {this.state.documento}
                            validators={["required"]}
					            	errorMessages={["Campo requerido"]}
                            onChange={this.ChangeDocumento}
                            disabled={true}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                             <label for = "FechaNacimiento">  Fecha de Nacimiento (*) </label>
                            <TextValidator type="date"className = "form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01" 
                                   value = {this.state.fechaNacimiento}
                                   validators={["required"]}
					            	errorMessages={["Campo requerido"]}
                                   onChange={this.ChangeFechaNacimiento}
                                   disabled={this.esPropietario}
                            />
                        </div>
                    </div>
                    <div className="form-group izquierda">
                        <Link to='/' type="button" className="btn boton btn-primary" variant="secondary" onClick={this.props.cerrar}
                            >Volver</Link> 
                    
                        <button className="btn boton btn-primary" variant="primary" type="submit"
                            >Editar</button>
                    </div>
              </div>
            </div>
            </ValidatorForm>
            )
        

    }
}
export default EditarInvitado;