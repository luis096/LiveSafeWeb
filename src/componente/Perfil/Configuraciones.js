import React, { Component } from 'react';
import firebase from 'firebase';
import Button from 'components/CustomButton/CustomButton.jsx';


class Configuraciones extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pass: ''
        };
        this.ChangePass = this.ChangePass.bind(this);
    }

    ChangePass(event) {
        this.setState({pass: event.target.value});
    }

    reestablecer(){
        debugger
         let newPassword = this.state.pass;
         firebase.auth().currentUser.updatePassword(newPassword).then(() =>{
         }, error=> {
            console.log(error.message);
        },)
        }
    

    render() {
        return (
            <div className="col-12">
                <div className="row card">
                    <div className="card-body">
                        <legend><h3 className="row"><i className="pe-7s-tools"/> Configuraciones</h3></legend>
                        <div className="row">
                            <div className="col-md-6 row-secction">
                                <h4><strong>Cambiar mi contraseña</strong></h4>
                                <input className='form-control'
                                       value={this.state.pass}
                                       onChange={this.ChangePass} placeholder="Nueva contraseña"/>
                                <Button bsStyle="default" fill wd onClick={()=> {
                                    this.reestablecer();
                                }}>Reestablecer</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Configuraciones;
