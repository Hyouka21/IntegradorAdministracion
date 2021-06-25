'use strict';
const {
    Model
} = require('sequelize');
const area = require('./area');
const historial = require('./historial');
module.exports = (sequelize, DataTypes) => {
    class Empleado extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Empleado.belongsTo(models.Area, {
                foreignKey: "id_area",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            });
            Empleado.hasMany(models.Historial, {
                foreignKey: "dni_empleado",
                allowNull: true,
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            })

        }
    };
    Empleado.init({
        dni: {
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        mail: DataTypes.STRING,
        telefono: DataTypes.BIGINT,
        contraseña: DataTypes.STRING,
        estado: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Empleado',
        createdAt: false,
        updatedAt: false,
    });
    return Empleado;
};