import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Database} from "../../config/config";
import {Link} from "react-router-dom"
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';

class EditarPropietario extends Component{

    constructor(props){
        super(props);
        this.state = {
            propietario: [], 
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            telefonoFijo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            usuario: '',
            idTipoPersona: '',
            idCountry: '',

            tipoD: [],// Para cargar el combo
            temp: '', 
            resultado: ''
        }
        this.editPropietario = this.editPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeDocumento = this.ChangeDocumento.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeRadio  = this.ChangeRadio.bind(this);
        this.ChangeTelefonoFijo = this.ChangeTelefonoFijo.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idPropietario  = url[url.length - 1];
    }

    async componentDidMount(){
        const { tipoD, propietario} = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, name: doc.data().Nombre}
                )
            });
        });
        await Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(this.idPropietario).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.propietario.push(doc.data());
                }
            })
            .catch(err => {
                //En caso de error, hacer esto...
            })
        this.setState({tipoD});
        this.setState({propietario});
        const estrella = this.state.propietario[0];
        console.log('estrella :', estrella);
        await Database.collection('TipoDocumento').doc(estrella.TipoDocumento.id).get()
            .then(doc => {
                if (doc.exists) {
                    
                    this.state.tipoDocumento = {value : doc.id, name : doc.data().Nombre}
                    console.log('object :', this.state.tipoDocumento.name);
                 }
            })
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            titular: estrella.Titular?'Si':'No',
            documento: estrella.Documento,
            fechaNacimiento: estrella.FechaNacimiento,
            fechaAlta: estrella.FechaAlta,
            telefonoFijo: estrella.TelefonoFijo,
            celular : estrella.Celular,
            descripcion: estrella.Descripcion,
            usuario: estrella.Usuario,
        })
    }
 

    editPropietario(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(this.idPropietario).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Titular: this.state.titular=== 'Si'?true:false,
            Celular: this.state.celular,
            TelefonoFijo: this.state.telefonoFijo,
            Descripcion: this.state.descripcion,
            TipoDocumento: this.state.tipoDocumento,
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
    ChangeTelefonoFijo(event) {
        this.setState({telefonoFijo: event.target.value});
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

    ChangeSelect(event){
        this.setState({tipoDocumento : event.target.value});
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
            this.editPropietario();
        }
    }

    render(){
        return(
            <ValidatorForm
            ref="form"
            onError={errors => console.log("hola",errors)}
            onSubmit={this.registrar}
            >
        <div className="col-12 ">
        <div>
            <div className="row">
                <legend>  Editar Propietario </legend>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "name" className = "form-control"   label = "Nombre (*)"
                        value = {this.state.nombre}
                        validators={["required"]}
                        errorMessages={["Campo requerido"]}
                        onChange={this.ChangeNombre}
                        />
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "family-name" className = "form-control"   label = "Apellido (*)"
                               value = {this.state.apellido}
                               validators={["required"]}
                                errorMessages={["Campo requerido"]}
                               onChange= {this.ChangeApellido} />
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                    {/* <SelectValidator
                            label="Tipo Documento (*)"
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            id = 'documento'
                            className="select-documento"
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="tipoDocumento"
                            value={this.state.tipoDocumento.value}
                            
                            
                                SelectProps={{
                                    native: true
                                }}
                            onChange={this.ChangeSelect.bind(this)}
                            >
                               <option value="0">Seleccionar</option>
                               {
                                this.state.tipoD.map(tipos =>{
                                    return(
                                        <option key={tipos.value} value={tipos.value}>
                                            {tipos.name}
                                        </option>
                                    );
                                })
                                }
                    </SelectValidator> */}
                    {/* <Field
                        label={}
                        component={Select}
                        onChange={ev => {
                            setFieldValue(
                                'tipoDoc.idTipoDoc',
                                parseInt(ev.target.options[ev.target.selectedIndex].value)
                            );
                        }}
                        id="cmb-documento"
                    > 
                        <option value="" />
                        {Object.keys(appConstants.typeDocument).filter(key => Number(key) !== 5).map(key => {
                            return (
                                <option key={key} value={key}>
                                    {t(appConstants.typeDocument[key])}
                                </option>
                            );
                        })}
                    </Field>*/}
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "document" className = "form-control"   label = "Numero de Documento (*)"
                        value = {this.state.documento}
                        validators={["required"]}
                        errorMessages={["Campo requerido"]}
                        onChange={this.ChangeDocumento}/>
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <label for = "FechaNacimiento">  Fecha de Nacimiento (*)  </label>
                        <TextValidator type="date"className = "form-control" name="FechaNacimiento"
                               step="1" min="1920-01-01"
                            //    validators={["required"]}
                            //   errorMessages={["Campo requerido"]}
                               onChange={this.ChangeFechaNacimiento}
                        />
                    </div>
                    <fieldset className = "col-md-6  flex-container form-group">
                        <legend>  Titular (*)  </legend>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                <TextValidator type = "radio" className = "form-check-input"  
                                value = 'Si' checked={this.state.titular === 'Si'}
                                validators={["required"]}
                                errorMessages={["Campo requerido"]}
                                onChange={this.ChangeRadio} />
                                    Si
                                </label>
                            </div>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                <TextValidator type = "radio" className = "form-check-input" value = 'No'
                                validators={["required"]}
                                errorMessages={["Campo requerido"]}
                                onChange={this.ChangeRadio} checked={this.state.titular === 'No'} />
                                        No
                                </label>
                            </div>
                    </fieldset>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "tel" className = "form-control"   label = "Celular (*)"
                        value = {this.state.celular}
                        validators={["required"]}
                        errorMessages={["Campo requerido"]}
                        onChange={this.ChangeCelular}/>
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "tel" className = "form-control"  
                         label = "Telefono Fijo "
                         value = {this.state.telefonoFijo}
                         onChange={this.ChangeTelefonoFijo}/>
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "email" className = "form-control" id = "exampleInputEmail1"
                               aria-describe  label = "Dirección de correo electrónico (*)"
                               validators={["required"]}
                               value = {this.state.usuario}
                        errorMessages={["Campo requerido"]}
                               value = {this.state.mail}
                               onChange={this.ChangeMail}/>
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator type = "password" className = "form-control" id = "exampleInputPassword1"
                               label = "Contraseña (*)"
                               value = {this.state.pass}
                               validators={["required"]}
                        errorMessages={["Campo requerido"]}
                               onChange={this.ChangePass}/>
                    </div>        
                    <div className = "col-md-6  flex-container form-group">
                        <TextValidator className = "form-control" id = "exampleTextarea" rows = "3"
                         value = {this.state.descripcion}
                         label= "Descripcion"
                         onChange={this.ChangeDescripcion}> </TextValidator>
                    </div>
                   
                    </div>
                    <div className="form-group izquierda">
                        <button className="btn btn-primary boton" type="submit" >Editar</button>
                        <Link to="/" type="button" className="btn btn-primary boton"
                    >Volver</Link> 
                    </div>
            </div>
        </div>
        </ValidatorForm>
        )


    }
}
export default EditarPropietario;