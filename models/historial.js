'use strict';
const {
    Model
} = require('sequelize');
const area = require('./area');
const empleado = require('./empleado');
const notificacion = require('./notificacion');
const solicitud = require('./solicitud');
module.exports = (sequelize, DataTypes) => {
    class Historial extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Historial.belongsTo(models.Area, {
                foreignKey: "id_area",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"

            });
            Historial.belongsTo(models.Solicitud, {
                foreignKey: "id_solicitud",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"

            });
            Historial.belongsTo(models.Empleado, {
                foreignKey: "dni_empleado",
                allowNull: true,
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });
            Historial.hasMany(models.Notificacion, {
                as: 'fecha_historial',
                sourceKey: "fecha_ingreso",
                foreignKey: "fecha_ingreso",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });
            Historial.hasMany(models.Notificacion, {
                as: 'area_historial',
                sourceKey: "id_area",
                foreignKey: "id_area",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });
            Historial.hasMany(models.Notificacion, {
                as: 'solicitud_historial',
                sourceKey: "id_solicitud",
                foreignKey: "id_solicitud",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });

        }
    };
    Historial.init({
        fecha_ingreso: {
            type: DataTypes.DATE,
            primaryKey: true
        },
        estado: DataTypes.STRING,
        detalle_razon: DataTypes.STRING,
        detalle_solucion: DataTypes.STRING,
        fecha_egreso: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_area: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        identificador: {
            type: DataTypes.INTEGER,
        }

    }, {
        sequelize,
        modelName: 'Historial',
        createdAt: false,
        updatedAt: false,

    });
    return Historial;
};