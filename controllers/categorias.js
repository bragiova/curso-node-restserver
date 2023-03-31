const { response } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) => {
    // Se extraen los parámetros o argumentos de la URL con req.query
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true}

    // Promise.all ejecuta las promesas simultáneamente
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario', {nombre: 1})
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate
const obtenerCategoria = async(req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', { nombre: 1});

    res.json(categoria);
}

const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {
    const {id} = req.params;

    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const nombre = data.nombre;

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}

// borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false} ,{new: true});

    res.json(categoria);
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
