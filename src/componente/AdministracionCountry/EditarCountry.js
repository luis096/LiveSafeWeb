import React, { Component } from 'react';
import "../Style/Alta.css";
import {Database} from '../../config/config';
import {Link} from 'react-router-dom'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


class EditarCountry extends Component{		
    constructor(props){
        super(props);
        this.state = { 
            barrio: [],               
            nombre: '',
            calle: '',
            numero: '',
            titular: '',
            celular: '',
            descripcion: '',
            resultado: ''
        }
    this.editCountry = this.editCountry.bind(this);
    this.ChangeNombre = this.ChangeNombre.bind(this);
    this.ChangeCalle = this.ChangeCalle.bind(this);
    this.ChangeNumero = this.ChangeNumero.bind(this);
    this.ChangeTitular = this.ChangeTitular.bind(this);
    this.ChangeCelular = this.ChangeCelular.bind(this);
    this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
    this.registrar = this.registrar.bind(this);
    const url = this.props.location.pathname.split('/');
    this.idBarrio  = url[url.length - 1];
    }


    async componentDidMount(){
      const { barrio } = this.state;
      await Database.collection('Country').doc(this.idBarrio).get()
          .then(doc => {
              if (doc.exists) {
                  this.state.barrio.push(doc.data());
              } else {
                  //Si no existe, hacer esto...
              }
          })
          .catch(err => {
              //En caso de error, hacer esto...
          })
      this.setState({barrio});
      const estrella = this.state.barrio[0];
      this.setState({
          nombre: estrella.Nombre,
          calle: estrella.Calle,
          numero: estrella.Numero,
          titular: estrella.Titular,
          celular: estrella.Celular,
          descripcion: estrella.Descripcion,
      })
  }

    editCountry(){
        
         Database.collection('Country').doc(this.idBarrio).set({
            Nombre: this.state.nombre,
            Calle: this.state.calle,
            Numero: this.state.numero,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
        });

}

	ChangeNombre(event) {
					this.setState({nombre : event.target.value});
	}
	ChangeCalle(event) {
					this.setState({calle: event.target.value});
			}
	ChangeNumero(event) {
					this.setState({numero: event.target.value});
	}

	ChangeCelular(event) {
		this.setState({celular : event.target.value});
}
ChangeTitular(event) {
	this.setState({titular : event.target.value});
}
ChangeDescripcion(event) {
	this.setState({descripcion : event.target.value});
}	

	registrar(){
		//Agregar validaciones para no registrar cualquier gilada
		if(true){
            this.editCountry();
            this.setState({
                nombre: '',
                calle: '',
                numero: '',
                titular: '',
                celular: '',
                descripcion: '',
                resultado: 'Se edito con exito',
            })
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
            <div className="col-md-12 ">
			<div className="row">
				<legend>  Registrar Alta de un Country </legend>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control "   
            label = "Nombre del Country (*)"
						value={this.state.nombre}
						validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeNombre}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Nombre del Titular (*)"
            value={this.state.titular}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeTitular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Calle (*)"
            value={this.state.calle}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeCalle}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Celular (*)"
            value={this.state.celular}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeCelular}/>
					</div>
					<div className = "col-md-6  flex-container form-group">
            <TextValidator type = "name" className = "form-control"   
            label = "Altura (*)"
            value={this.state.numero}
            validators={["required"]}
						errorMessages={["Campo requerido"]}
						onChange ={this.ChangeNumero}/>
					</div>
					
					
					<div className = "col-md-6  flex-container form-group">
            <TextValidator className = "form-control" id = "exampleTextarea" rows = "3"  
              label = "Descripcion"
              value = {this.state.descripcion}
              onChange={this.ChangeDescripcion}> 
            </TextValidator>
          </div>
					<div>
						<span>
							<strong>{this.state.resultado}</strong>
						</span>
					</div>
          </div>
		  	
          	<div className="form-group izquierda">
			      <button className="btn btn-primary boton" type="submit">Editar</button> 
            <Link to="/" type="button" className="btn btn-primary boton">Volver</Link>                 
		    </div>
        </div>
		
      </div>
	  </ValidatorForm>
        
        );
    }
}

export default EditarCountry;