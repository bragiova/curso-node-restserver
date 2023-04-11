const { response } = require("express");
const { subirArchivo } = require("../helpers/");
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require("fs");
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req, res = response) => {

    // llamada a helper
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({
            nombre
        });
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        // Borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();

    res.json({
        modelo
    })
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        // Imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // Sin imagen
    const pathImagenRelleno = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImagenRelleno);
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
               return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    //Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombreImg = nombreArr[nombreArr.length - 1];
        const [public_id] = nombreImg.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json({
        modelo
    });
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
