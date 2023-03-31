const { response } = require("express");
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res = response) => {
    // Se extraen los parámetros o argumentos de la URL con req.query
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true}

    // Promise.all ejecuta las promesas simultáneamente
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite)
            .populate('usuario', {nombre: 1})
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

// obtenerCategoria - populate
const obtenerProducto = async(req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', { nombre: 1})
                            .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async(req, res = response) => {
    const { estado, usuario, ...datos } = req.body;
    datos.nombre = datos.nombre.toUpperCase();
    const nombre = datos.nombre

    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...datos,
        nombre,
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarProducto
const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;

    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();

        const nombre = data.nombre;

        const productoDB = await Producto.findOne({nombre});

        if (productoDB) {
            return res.status(400).json({
                msg: `La categoría ${productoDB.nombre}, ya existe`
            });
        }
    }
    
    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

// borrarProducto - estado: false
const borrarProducto = async(req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false} ,{new: true});

    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}