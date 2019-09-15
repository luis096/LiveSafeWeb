import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Link} from 'react-router-dom'
import {Database, Firebase} from "../../config/config";
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';


class AltaEncargado extends Component{

    constructor(){
        super();
        this.state = {
            idEncargadoCreado: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            legajo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            fechaAlta: '', 
            mail: '',
            pass: '',
            idCountry: '',
            tipoD: [],// Para cargar el combo
            resultado: ''
        }
        this.addEncargado= this.addEncargado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeLegajo = this.ChangeLegajo.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.registrar = this.registrar.bind(this);

    }

    async componentDidMount(){
        const { tipoD } = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, name: doc.data().Nombre}
                )
            });
        });
        this.setState({tipoD});
    }


    async addEncargado(){
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Encargados').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Legajo: this.state.legajo,
            Documento: this.state.documento,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: new Date(),
            Usuario: this.state.mail,
        }).then(doc => {
                this.setState({ idEncargadoCreado: doc.id })
            });
        await this.crearUsuario();

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    ChangeLegajo(event) {
        this.setState({legajo: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular : event.target.value});
    }
    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
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

    ChangeMail(event) {
        this.setState({mail : event.target.value});
    }
    ChangePass(event) {
        this.setState({pass : event.target.value});
    }


    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addEncargado();
        }
    }

    async crearUsuario(){
        const {mail} = this.state;
        const {pass} = this.state;
        if (true){
            Firebase.auth().createUserWithEmailAndPassword(mail, pass).then(
                await  Database.collection('Usuarios').doc(mail).set({
                    NombreUsuario: mail,
                    TipoUsuario: Database.doc('/TiposUsuario/Encargado'),
                    IdCountry: Database.doc('Country/'+ localStorage.getItem('idCountry')),
                    IdPersona: Database.doc('Country/'+ localStorage.getItem('idCountry') + '/Encargados/' + this.state.idEncargadoCreado),
                })
            )
            .catch(function(error) {
              console.log('error :', error);
              //La pass debe tener al menos 6 caracteres wachina
            });
           

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
            <legend>  Registrar Alta de un Encargado</legend>
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
                  {/* <Select
                      className="select-documento"
                      classNamePrefix="select"
                      defaultValue={this.state.tipoD[0]}
                      isDisabled={false}
                      isLoading={false}
                      isClearable={true}
                      isSearchable={true}
                      options={this.state.tipoD}
                      onChange={this.ChangeSelect.bind(this)}
                  /> */}
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
export default  AltaEncargado;
