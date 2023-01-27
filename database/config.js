const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // no usar, da error
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('BD de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar el proceso');
    }
}

module.exports = {
    dbConnection
}