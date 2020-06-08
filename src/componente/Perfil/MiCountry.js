import React, { Component } from 'react';
import { Database, Storage } from 'config/config';


class MiCountry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            barrio: '',
            imagen: ''
        };

    }

    async componentDidMount() {

        let { barrio, imagen } = this.state;
        await Database.collection('Country').doc(localStorage.getItem('idCountry')).get().then((doc)=>{
            barrio = doc.data();
        });

        Storage.ref(barrio.Imagen).getDownloadURL().then((url)=>{
            document.getElementById('imgBarrio').src = url;
        });
        this.setState({barrio, imagen});
    }


    render() {
        let { barrio } = this.state;
        return (
            <div className="col-12">
                <div className="row card">
                    <div className="card-body">
                        <legend><h3 className="row">Mi Barrio</h3></legend>
                        <div className="row">
                            <div className="col-md-3 row-secction">
                                <h4><strong>Nombre del barrio</strong></h4>
                                <h5>{barrio.Nombre}</h5>
                            </div>
                            <div className="col-md-3 row-secction">
                                <h4><strong>Calle y Número</strong></h4>
                                <h5>{barrio.Calle + ' ' + barrio.Numero}</h5>
                            </div>
                            <div className="col-md-3 row-secction">
                                <h4><strong>Contacto</strong></h4>
                                <h5>{barrio.Celular || 'Sin Datos'}</h5>
                            </div>
                            <div className="col-md-3 row-secction">
                                <h4><strong>Descripción del barrio</strong></h4>
                                <h5>{barrio.Descripcion || 'Sin Datos'}</h5>
                            </div>
                        </div>
                        <div className="row col-md-3">
                            <img id="imgBarrio" height="420" width="420"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MiCountry;
