
import React, { Component } from "react";
import { Database } from 'config/config';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Grid,
  Row,
  Col
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import UserCard from "components/Card/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import avatar from "assets/img/default-avatar.png";

class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        userName:'',
        mail:'',
        nombre:'',
        apellido:'',
        tipoDocumento:'',
        nroDocumento:'',
        telefono:'',
        celular:'',
        fechaNacimiento:'',
        tipoDocumentoNombre: ''     
    };
    this.actualizar = this.actualizar.bind(this);
    this.consultar = this.consultar.bind(this);
    this.ChangeNombre = this.ChangeNombre.bind(this);
    this.ChangeApellido = this.ChangeApellido.bind(this);
    this.ChangeUserName = this.ChangeUserName.bind(this);
    this.ChangeTelefono = this.ChangeTelefono.bind(this);
    this.ChangeCelular = this.ChangeCelular.bind(this);
    var datos = {};
  }

  async componentDidMount() {
    const user = localStorage.getItem('tipoUsuario');
    switch (user) {
      case "Root":
        this.datos = Database.collection('Root').doc(localStorage.getItem('idPersona'));
        break;
      case "Administrador":
        this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
              .collection('Administradores').doc(localStorage.getItem('idPersona'));
        break;
      case "Propietario":
        this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').doc(localStorage.getItem('idPersona'));
        break;
      case "Encargado":
        this.datos = Database.collection('Country').doc(localStorage.getItem('idCountry'))
              .collection('Encargados').doc(localStorage.getItem('idPersona'));
        break;
    }
    await this.consultar()
  }

  async consultar(){
    await this.datos.get().then(doc=> {
      if (doc.exists) {
          this.setState({
            nombre: doc.data().Nombre,
            apellido: doc.data().Apellido,
            celular: doc.data().Celular,
            telefono: doc.data().Telefono,
            nroDocumento: doc.data().Documento,
            tipoDocumento: doc.data().TipoDocumento,
            fechaNacimiento: doc.data().FechaNacimiento,
            mail: doc.data().Usuario,
            userName: doc.data().UserName
          })
      } 
    });
    await Database.collection('TipoDocumento').doc(this.state.tipoDocumento.id).get()
      .then(doc=> {
          if (doc.exists) {
              this.setState({tipoDocumentoNombre : doc.data().Nombre});
          }
      });
  }

  actualizar() {
    this.datos.set({
      Nombre: this.state.nombre,
      Apellido: this.state.apellido,
      Celular: this.state.celular,
      Telefono: this.state.telefono,
      Documento: this.state.nroDocumento,
      TipoDocumento: this.state.tipoDocumento,
      FechaNacimiento: this.state.fechaNacimiento,
      Usuario: this.state.mail,
      UserName: this.state.userName
    }); 
  }

  ChangeNombre(event) {
    this.setState({nombre: event.target.value});
  }

  ChangeApellido(event) {
      this.setState({apellido: event.target.value});
  }

  ChangeUserName(event) {
    this.setState({userName: event.target.value});
  }

  ChangeTelefono(event) {
      this.setState({telefono: event.target.value});
  }

  ChangeCelular(event) {
    this.setState({celular: event.target.value});
  }

  render() {
    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
          <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name={this.state.nombre + ' ' + this.state.apellido}
                userName={this.state.userName}
              />
            </Col>
            <Col md={8}>
              <Card
                title="Mi Perfil"
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "Nombre de Usuario",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Username",
                          value: this.state.userName,
                          onChange: this.ChangeUserName
                        },
                        {
                          label: "Direccion de Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          value: this.state.mail,
                          disabled: true
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "Nombre",
                          type: "text",
                          bsClass: "form-control",
                          value: this.state.nombre,
                          onChange: this.ChangeNombre
                        },
                        {
                          label: "Apellido",
                          type: "text",
                          bsClass: "form-control",
                          value: this.state.apellido,
                          onChange: this.ChangeApellido
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "Tipo Documento",
                          type: "text",
                          bsClass: "form-control",
                          value: this.state.tipoDocumentoNombre,
                          disabled: true
                        },
                        {
                          label: "Nro Documento",
                          type: "text",
                          bsClass: "form-control",
                          value: this.state.nroDocumento,
                          disabled: true
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-6", "col-md-6"]}
                      proprieties={[
                        {
                          label: "Teléfono",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "telefono",
                          value: this.state.telefono,
                          onChange: this.ChangeTelefono
                        },
                        {
                          label: "Celular",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Celular",
                          value: this.state.celular,
                          onChange: this.ChangeCelular
                        }
                      ]}
                    />
                     <FormInputs
                      ncols={["col-md-12"]}
                      proprieties={[
                        {
                          label: "Fecha de Nacimiento",
                          type: "date",
                          bsClass: "form-control",
                          value: this.state.fechaNacimiento
                        }
                      ]}
                    />
                    <Button bsStyle="info" pullRight fill onClick={this.actualizar}>
                      Actualizar Perfil
                    </Button>
                    <Button bsStyle="danger" pullRight fill onClick={this.consultar}>
                      Reestablecer
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserPage;
