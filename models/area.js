'use strict';
const {
    Model
} = require('sequelize');

const empleado = require('./empleado');
module.exports = (sequelize, DataTypes) => {
    class Area extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Area.hasMany(models.Empleado, {
                foreignKey: "id_area",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            })
            Area.hasMany(models.Historial, {
                foreignKey: "id_area",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT"
            })
        }
    };
    Area.init({
        id_area: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_area: DataTypes.STRING,
        estado: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Area',
        createdAt: false,
        updatedAt: false,
    });
    return Area;
};