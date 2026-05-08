const CategoriaDAO = require('../daos/CategoriaDAO');

const crearCategoria = async({ nombre }) => {
    const existente = await CategoriaDAO.obtenerPorNombre(nombre);
    if (existente) {
        const error = new Error('Ya existe una categoría con ese nombre');
        error.status = 409;
        throw error;
    }

    return await CategoriaDAO.crear({ nombre });
};

const obtenerTodas = async() => {
    return await CategoriaDAO.obtenerTodos();
};

const obtenerPorId = async(id_categoria) => {
    const categoria = await CategoriaDAO.obtenerPorId(id_categoria);
    if (!categoria) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }
    return categoria;
};

const actualizarCategoria = async(id_categoria, campos) => {
    const existente = await CategoriaDAO.obtenerPorId(id_categoria);
    if (!existente) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }

    if (
        campos.nombre &&
        campos.nombre.toLowerCase() !== existente.nombre.toLowerCase()
    ) {
        const duplicado = await CategoriaDAO.obtenerPorNombre(campos.nombre);
        if (duplicado) {
            const error = new Error('Ya existe una categoría con ese nombre');
            error.status = 409;
            throw error;
        }
    }

    return await CategoriaDAO.actualizar(id_categoria, campos);
};

const eliminarCategoria = async(id_categoria) => {
    const eliminado = await CategoriaDAO.eliminar(id_categoria);
    if (!eliminado) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }
    return { mensaje: 'Categoría eliminada correctamente' };
};

module.exports = {
    crearCategoria,
    obtenerTodas,
    obtenerPorId,
    actualizarCategoria,
    eliminarCategoria,
};