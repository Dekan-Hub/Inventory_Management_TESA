/**
 * @file 005-create-equipos.js
 * @description Migración para crear la tabla 'equipos' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('equipos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: { // Corresponds to 'nombre' in document (varchar(100))
                type: Sequelize.STRING(100),
                allowNull: false
            },
            marca: { // Corresponds to 'marca' in document (varchar(50))
                type: Sequelize.STRING(50),
                allowNull: true // Asumiendo que es nullable
            },
            modelo: { // Corresponds to 'modelo' in document (varchar(50))
                type: Sequelize.STRING(50),
                allowNull: true // Asumiendo que es nullable
            },
            numero_serie: { // Corresponds to 'numero_serie' in document (varchar(100) unique not null)
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            fecha_adquisicion: { // Corresponds to 'fecha_adquisicion' in document (date)
                type: Sequelize.DATEONLY, // Usar DATEONLY para solo fecha
                allowNull: true
            },
            // Las siguientes son Foreign Keys (FK)
            TipoEquipoid: { // Corresponds to 'tipo_equipo_id' in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'tipo_equipo', // Nombre de la tabla referenciada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL' // O 'RESTRICT', 'CASCADE'
            },
            EstadoEquipoid: { // Corresponds to 'estado_id' in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'estado_equipo', // Nombre de la tabla referenciada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            Ubicacionid: { // Corresponds to 'ubicacion_id' in document (allowNull: true)
                type: Sequelize.INTEGER,
                allowNull: true, // Según tu esquema, esta columna puede ser NULL
                references: {
                    model: 'ubicaciones', // Nombre de la tabla referenciada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            observaciones: { // Corresponds to 'observaciones' in document (text) - CORRECCIÓN CLAVE
                type: Sequelize.TEXT,
                allowNull: true
            },
            // NOTA: 'created_at' y 'updated_at' no están en tu definición SQL para 'equipos',
            // por lo tanto, no se incluyen aquí para una estricta adherencia.
            // Si el modelo Equipo en Sequelize tiene `timestamps: true`, Sequelize intentará
            // manejar estas columnas, pero la migración las omitiría. Es mejor que el modelo
            // también tenga `timestamps: false` si no las usas.
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('equipos');
    }
};