
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// Para excluir atributos o campos al momento de insertar en mongo, se usa el operador rest ... para almacenar el resto en una variable
CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    
    return data;
}

module.exports = model('Categoria', CategoriaSchema);
