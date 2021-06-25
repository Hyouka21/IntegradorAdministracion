'use strict';
const {
    Model
} = require('sequelize');
const solicitud = require('./solicitud');
module.exports = (sequelize, DataTypes) => {
    class Cliente extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cliente.hasMany(models.Solicitud, {
                foreignKey: "dni_cliente",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            })
        }
    };
    Cliente.init({
        dni: {
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        mail: DataTypes.STRING,
        celular: DataTypes.BIGINT,
        contraseña: DataTypes.STRING,
        fecha: DataTypes.DATE,
        estado: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Cliente',
        createdAt: false,
        updatedAt: false,
    });
    return Cliente;
};