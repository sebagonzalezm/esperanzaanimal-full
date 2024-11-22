const {config} = require('dotenv')
config()

module.exports = {
    db: {
        user: 'postgres',          // Usuario de la base de datos
        password: '1234seba',      // Contraseña de la base de datos
        host: 'localhost',         // Host donde está PostgreSQL
        port: 5433,                // Puerto en el que escucha PostgreSQL
        database: 'esperanza-animal' // Nombre de la base de datos
    }
}
