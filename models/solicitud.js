'use strict';
const {
    Model
} = require('sequelize');
const cliente = require('./cliente.js');
const historial = require('./historial.js');
module.exports = (sequelize, DataTypes) => {
    class Solicitud extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Solicitud.hasMany(models.Historial, {
                foreignKey: "id_solicitud",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            })
            Solicitud.belongsTo(models.Cliente, {
                foreignKey: "dni_cliente",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });

        }
    };
    Solicitud.init({
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ticket: DataTypes.BIGINT,
        prioridad: DataTypes.STRING,
        fecha_solicitud: DataTypes.DATE,
        detalle: DataTypes.STRING,
        tipo: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Solicitud',
        createdAt: false,
        updatedAt: false,
    });
    return Solicitud;
};