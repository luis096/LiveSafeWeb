import React from 'react';
import {Database} from '../config/config';

const PERFILES = ['/Root/', '/Administradores/', '/Encargados/', '/Propietarios/'];
const DIAS = ['Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const EstadosServicioSelect = [{value: true, label:'Disponible'}, {value: false, label:'No Disponible'}];
const MinutosReserva = [{value: 0, label:'0'}, {value: 30, label:'30'}];

export const constantes = {
    EstadosServicioSelect,
    MinutosReserva
};

export const operacion = {
    obtenerTiposDocumento,
    obtenerDocumentoLabel,
    obtenerReferenciaDocumento,
    obtenerMiReferencia,
    obtenerReferenciaConId,
    obtenerDisponibleString,
    esDiaDisponible,
    error,
    registroConExito,
    obtenerMeses,
    obtenerAnios,
    obtenerMesesLabels,
    sinResultados
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


    return resultado;
}

function esDiaDisponible(dias, dia){
    let elementos = Object.assign([], dias);
    elementos.unshift(dias[6]);
    return !!elementos[dia];
}

function error(mensaje) {
    let obj = {
        title: <span data-notify="icon" className="pe-7s-close-circle"/>,
        message: (<div>{mensaje}</div>),
        level: "error",
        position: "br",
        autoDismiss: 7
        };
    return obj;
}


function registroConExito(mensaje) {
    let obj = {
        title: <span style={{color: "black"}} data-notify="icon" className="pe-7s-check"/>,
        message: (<div style={{color: "black"}}>{mensaje}</div>),
        level: "success",
        position: "br",
        autoDismiss: 5
    };
    return obj;
}

function obtenerMeses(num) {
    let esHasta = num === 2?12:0;
    let meses = [
        { value:( 1 + esHasta) , label: "Enero" },
        { value:( 2 + esHasta) , label: "Febrero" },
        { value:( 3 + esHasta) , label: "Marzo" },
        { value:( 4 + esHasta) , label: "Abril" },
        { value:( 5 + esHasta) , label: "Mayo" },
        { value:( 6 + esHasta) , label: "Junio" },
        { value:( 7 + esHasta) , label: "Julio" },
        { value:( 8 + esHasta) , label: "Agosto" },
        { value:( 9 + esHasta) , label: "Septiembre" },
        { value:( 10 + esHasta) , label: "Octubre" },
        { value:( 11 + esHasta) , label: "Noviembre" },
        { value:( 12 + esHasta) , label: "Diciembre" },
        ];
    return meses;
}

function obtenerAnios() {
    let anios = [{ value: 2019, label: "2019" },
        { value: 2020, label: "2020" }];
    return anios;
}

function obtenerMesesLabels(desde, hasta, mismoAnio) {
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    let labels = [];
    let limiteHasta = mismoAnio?hasta-12:hasta;
    for(var i = desde; i <= limiteHasta; i++) {
        labels.push(meses[i - 1]);
    }

    return labels;
}

function sinResultados() {
    let obj = {
        title: <span style={{color: "black"}} data-notify="icon" className="pe-7s-attention"/>,
        message: (<div style={{color: "black"}}>No se encontraron resultados.</div>),
        level: "warning",
        position: "bc",
        autoDismiss: 3
    };
    return obj;
}
