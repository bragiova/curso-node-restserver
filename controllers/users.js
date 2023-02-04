
const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req, res = response) => {
    // Se extraen los parámetros o argumentos de la URL con req.query
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    //         .skip(desde)
    //         .limit(limite);

    // const total = await Usuario.countDocuments(query);

    // Promise.all ejecuta las promesas simultáneamente
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    // const body = req.body;
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salto = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salto);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const {id} = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    // Validar contra base de datos
    if (password) {
        const salto = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salto);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    // Físicamente borrar registro
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false} ,{new: true});

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
