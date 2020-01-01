

export const filtros = {
    filtroNombre,
    filtroEstado,
    filtroApellido,
    filtroDocumento
};

function filtroNombre(elementos, filtro) {
    let filtrado = [];
    elementos.map( e =>{
        if (e[0].Nombre == filtro){
            filtrado.push(e);
        }
    });
    return filtrado;
}

function filtroApellido(elementos, filtro) {
    let filtrado = [];
    elementos.map( e =>{
        if (e[0].Apellido == filtro){
            filtrado.push(e);
        }
    });
    return filtrado;
}

function filtroEstado(elementos, filtro) {
    let filtrado = [];
    elementos.map( e =>{
        if (e[0].Estado == filtro){
            filtrado.push(e);
        }
    });
    return filtrado;
}

function filtroDocumento(elementos, filtro) {
    let filtrado = [];
    elementos.map( e =>{
        if (e[0].Documento == filtro){
            filtrado.push(e);
        }
    });
    return filtrado;
}
