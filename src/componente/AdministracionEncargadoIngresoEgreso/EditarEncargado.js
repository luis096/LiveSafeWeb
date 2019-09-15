import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Database} from "../../config/config";
import {Link} from "react-router-dom"
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';


class EditarEncargado extends Component{
    constructor(props){
        super(props);
        this.state = {
            encargados: [], 
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            legajo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '',
            usuario: '',
            idCountry: '',

            tipoD: [],// Para cargar el combo
            temp: '', // Puto el que lee
            resultado: ''
        }
        this.editEncargado = this.editEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeLegajo = this.ChangeLegajo.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idEncargado  = url[url.length - 1];
    }

    async componentDidMount(){
        const { tipoD, encargados} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )
            });
        });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Encargados').doc(this.idEncargado).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.encargados.push(doc.data());
                } else {
                
                }
            })
            .catch(err => {
                //En caso de error, hacer esto...
            })
        this.setState({tipoD});
        this.setState({encargados});
        const estrella = this.state.encargados[0];
        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc => {
                if (doc.exists) {
                   this.state.tipoDocumento = {value : doc.id, label : doc.data().Nombre}
                }
            })
    
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            legajo: estrella.Legajo,
            documento: estrella.Documento,
            fechaNacimiento: estrella.FechaNacimiento,
            fechaAlta: estrella.FechaAlta,
            celular : estrella.Celular,
            descripcion: estrella.Descripcion,
            usuario: estrella.Usuario,
        })
    }


    editEncargado(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Encargados').doc(this.idEncargado).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Legajo: this.state.legajo,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: this.state.fechaAlta,
            Usuario: this.state.usuario, 
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    ChangeNumero(event) {
        this.setState({numero: event.target.value});
    }
    ChangeLegajo(event) {
        this.setState({legajo: event.target.value});
    }
    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }
    ChangeCelular(event) {
        this.setState({celular : event.target.value});
    }
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }
    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    ChangeRadio(event){
        this.setState({titular: event.currentTarget.value})
    }

    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.editEncargado();

        }
    }

    render(){
        return(
          <ValidatorForm
          ref="form"
          onError={errors => console.log("hola",errors)}
          onSubmit={this.registrar}
          >
        <div className="col-12">
          <div className="row">
            <legend>  Editar Encargado </legend>
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator type = "name" className = "form-control"   
                  label = "Nombre (*)"
                  value={this.state.nombre}
                  validators={["required"]}
                  errorMessages={["Campo requerido"]}
                  onChange={this.ChangeNombre}
                  />
              </div>
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator type = "family-name" className = "form-control"   
                    label = "Apellido (*)"
                    value={this.state.apellido}
                    validators={["required"]}
                    errorMessages={["Campo requerido"]}
                    onChange= {this.ChangeApellido} />
              </div>
              <div className = "col-md-6  flex-container form-group">
              <label for = "TipoDocumento (*)">  Tipo Documento  </label>
              <SelectValidator
                            label="Tipo Documento (*)"
                            // validators={["required"]}
                            // errorMessages={["Campo requerido"]}
                            id = 'documento'
                                className="select-documento"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
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
                    validators={["required"]}
                    errorMessages={["Campo requerido"]}
                    value={this.state.documento}
                    onChange={this.ChangeDocumento}/>
              </div>
              <div className = "col-md-6  flex-container form-group">
                  <label for = "FechaNacimiento (*)">  Fecha de Nacimiento  </label>
                  <TextValidator type="date"className = "form-control" name="FechaNacimiento"
                    step="1" min="1920-01-01"
                    validators={["required"]}
                    errorMessages={["Campo requerido"]}
                    onChange={this.ChangeFechaNacimiento}
                  />
              </div>
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator type = "tel" className = "form-control"   
                  label = "Legajo (*)"
                  value={this.state.legajo}
                  validators={["required"]}
                  errorMessages={["Campo requerido"]}
                  onChange={this.ChangeLegajo}/>
              </div>
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator type = "tel" className = "form-control"   
                  label = "Celular (*)"
                  value={this.state.celular}
                  validators={["required"]}
                  errorMessages={["Campo requerido"]}
                  onChange={this.ChangeCelular}/>
              </div>
              <div className = "col-md-6  flex-container form-group">
                <TextValidator type = "email" className = "form-control" id = "exampleInputEmail1"
                        aria-describe by = "emailHelp" 
                        label = "Dirección de correo electrónico (*)"
                        value={this.state.mail}
                        validators={["required"]}
                        errorMessages={["Campo requerido"]}
                        onChange={this.ChangeMail}/>
              </div>
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator type = "password" className = "form-control" id = "exampleInputPassword1"
                    label = "Contraseña (*)"
                    validators={["required"]}
                    errorMessages={["Campo requerido"]}
                    value={this.state.pass}
                    onChange={this.ChangePass}/>
              </div>        
              <div className = "col-md-6  flex-container form-group">
                  <TextValidator className = "form-control" id = "exampleTextarea" rows = "3"
                    label="Descripcion"
                    value={this.state.descripcion}
                    onChange={this.ChangeDescripcion}
                    > </TextValidator>

              </div>
            </div>
            <div className="form-group izquierda">
              <button className="btn btn-primary boton" type="submit" >Registrar</button>
              <Link to="/" type="button" className="btn btn-primary boton"
              >Volver</Link> 
            </div>
        </div>
        </ValidatorForm>
        )


    }
}
export default EditarEncargado;