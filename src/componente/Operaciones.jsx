import React from 'react';
import { Database } from '../config/config';


const PERFILES = ['/Root/', '/Administradores/', '/Encargados/', '/Propietarios/'];
const DIAS = ['Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const EstadosServicioSelect = [{value: true, label:'Disponible'}, {value: false, label:'No Disponible'}];

export const constantes = {
    EstadosServicioSelect,
};

export const operacion = {
    obtenerTiposDocumento,
    obtenerDocumentoLabel,
    obtenerReferenciaDocumento,
    obtenerMiReferencia,
    obtenerReferenciaConId,
    obtenerDisponibleString
    
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

function obtenerDisponibleString(value){
    let resultado = '';
    value.map((dia, i)=>{
        if(dia){
            resultado += '-' + DIAS[i];
        }
    });
    return resultado;
}
