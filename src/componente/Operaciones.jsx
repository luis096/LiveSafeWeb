import React from 'react';
import { Database } from '../config/config';


const PERFILES = ['/Root/', '/Administradores/', '/Encargados/', '/Propietarios/'];

export const operacion = {
    obtenerTiposDocumento,
    obtenerDocumentoLabel,
    obtenerReferenciaDocumento,
    obtenerMiReferencia,
    obtenerReferenciaConId
};

async function obtenerTiposDocumento() {
    let resultado = [];

    await Database.collection('TipoDocumento').get().then(querySnapshot=> {
        querySnapshot.forEach(doc=> {
            resultado.push(
                {value: doc.id, label: doc.data().Nombre}
            );
        });
    });

    return resultado;
}


function obtenerDocumentoLabel(id, value) {
    let resultado = '';
    value.map(doc=> {
        if (doc.value === id) {
            resultado = doc.label;
        }
    });
    return resultado;
}

function obtenerReferenciaDocumento(tipoDocumento) {
    let resultado = Database.doc('TipoDocumento/' + tipoDocumento.value);
    return resultado;
}


function obtenerMiReferencia(num) {
    let resultado = Database.doc('Country/' + localStorage.getItem('idCountry')
        + PERFILES[num] + localStorage.getItem('idPersona'));
    return resultado;
}

function obtenerReferenciaConId(num, id) {
    let resultado = Database.doc('Country/' + localStorage.getItem('idCountry')
        + PERFILES[num] + id);
    return resultado;
}

//
// async buscarEnIngresos() {
//     let refTipoDocumento = Database.doc('TipoDocumento/' + this.state.tipoDocumento.value);
//     await Database.collection('Country').doc(localStorage.getItem('idCountry'))
//         .collection('Ingresos').orderBy('Hora', 'asc')
//         .where('Documento', '==', this.state.documento).where('TipoDocumento', '==', refTipoDocumento)
//         .get().then(querySnapshot=> {
//             querySnapshot.forEach(doc=> {
//                 if (!doc.data().Egreso) {
//                     this.setState({observacion: true});
//                 } else if (doc.data().Egreso) {
//                     this.setState({observacion: false});
//                 }
//             });
//         });
// }