

export const filtros = {
    filtroNombre,
    filtroEstado,
    filtroApellido,
    filtroDocumento
};

function filtroNombre(elementos, filtro) {
    let filtrado = [];
    filtro = filtro.toLowerCase().trim();
    elementos.map( e =>{
        if (e[0].Nombre.toLowerCase() == filtro){
            filtrado.push(e);
        }
    });
    return filtrado;
}

function filtroApellido(elementos, filtro) {
    let filtrado = [];
    filtro = filtro.toLowerCase().trim();
    elementos.map( e =>{
        if (e[0].Apellido.toLowerCase() == filtro){
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
