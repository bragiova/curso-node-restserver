const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/rol');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

// Verificar si el correo existe
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la BD`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`)
    }
}

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    
    if (!existeCategoria) {
        throw new Error(`La categoría con id ${id}, no existe`)
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    
    if (!existeProducto) {
        throw new Error(`El producto con id ${id}, no existe`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
}
