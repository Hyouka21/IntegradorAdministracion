'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notificacion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            Notificacion.belongsTo(models.Historial, {
                foreignKey: "fecha_ingreso"
            });

        }
    };
    Notificacion.init({
        id_notificacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: DataTypes.DATE,
        descripcion: DataTypes.STRING,
        estado: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Notificacion',
        createdAt: false,
        updatedAt: false,
    });
    return Notificacion;
};