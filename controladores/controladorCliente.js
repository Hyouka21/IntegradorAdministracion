const area = require("../models").Area;
const his = require("../models").Historial;
const sol = require("../models").Solicitud;
const emp = require("../models").Empleado;
const cli = require("../models").Cliente;
const sequelize = require("../models/index").sequelize;
const moment = require('moment');
exports.inicioCliente = async(req, res, next) => {
    let dni = req.session.usuario;
    let cliente = req.session.cliente;
    let solicitudes = await sol.findAll({
        where: {
            dni_cliente: dni
        }
    });
    res.render("../views/cliente/cliente.pug", { sol: solicitudes, cliente: cliente, error: req.flash().error, mensaje: req.flash().mensaje });

};
exports.crearCliente = async(req, res, next) => {
    let dni = req.session.usuario;
    let cliente = req.session.cliente;
    let tipo = req.body.tipo;
    let detalle = req.body.detalle;
    const random = Math.floor(Math.random() * 100000);
    let ticket = "";
    ticket = Date.now() + random;
    let resultado;
    try {
        const { results, metadata } = await sequelize.query(` CALL insertarSolicitud("${ticket}", "${detalle}", "${tipo}", "${dni}");`);
        resultado = results;
        console.log(resultado);

    } catch (e) {
        console.log(e);
    }
    req.flash("mensaje", "La solicitud se creo con exito");
    res.redirect('../cliente');

};