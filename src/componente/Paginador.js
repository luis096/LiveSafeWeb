const TAMANIO_PAGINA = 10;

export const paginador = {
    paginar,
    cantidad,
    getTamPagina
};

function paginar(pagina, todos) {
    const elementos = [];
    let desde = pagina * TAMANIO_PAGINA;
    let hasta = desde + TAMANIO_PAGINA;
    let tam = todos.length;
    if (tam < hasta) {
        hasta = tam;
    }
    for (var i = desde; i < hasta; i++) {
        elementos.push(todos[i]);
    }
    return ({Elementos: elementos, NumPagina: pagina});
}

function cantidad(tam) {
    let array = [];
    for (var i = 0; i < (tam / TAMANIO_PAGINA); i++) {
        array.push(i);
    }
    return (array);
}

function getTamPagina() {
    return (TAMANIO_PAGINA);
}
