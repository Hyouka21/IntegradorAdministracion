const area = require("../models").Area;
const his = require("../models").Historial;
const sol = require("../models").Solicitud;
const emp = require("../models").Empleado;
const cli = require("../models").Cliente;
const not = require("../models").Notificacion;
const moment = require('moment');
const sequelize = require("../models/index").sequelize;
const bcrypt = require("bcrypt");
exports.inicio = async(req, res, next) => {
    let dni = req.session.usuario;
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let calidad = req.session.calidad;
    let registro;
    if (req.flash().dni != undefined) {
        let dniR = req.flash().dni;
        let nombreR = req.flash().nombre;
        let apellidoR = req.flash().apellido;
        let emailR = req.flash().email;
        let telefonoR = req.flash().telefono;
        let fechaR = req.flash().fecha;
        registro = { "fecha": fechaR, "telefono": telefonoR, "email": emailR, "apellido": apellidoR, "nombre": nombreR, "dni": dniR, }

    }
    if (cliente) {
        let usu = await cli.findByPk(dni);
        res.render("../views/index.pug", { title: 'Help Desk', usuario: usu, cliente: cliente, empleado: empleado, gestion: gestion, mensaje: req.flash().mensaje });
    } else if (empleado) {
        let noti = await not.findAll({
            where: {
                estado: "no visto"
            }
        });
        let usu = await emp.findByPk(dni);
        let cantidad = noti.length;
        res.render("../views/index.pug", { title: 'Help Desk', usuario: usu, cliente: cliente, empleado: empleado, gestion: gestion, mensaje: req.flash().mensaje, calidad: calidad, cantidadN: cantidad });
    } else {
        res.render("../views/index.pug", { registro: registro, title: 'Help Desk', error: req.flash().error, mensaje: req.flash().mensaje });
    }
};
exports.registrar = async(req, res, next) => {
    let usu = req.session.usuario;
    if (usu) {
        res.redirect('../');
    } else {
        let dni = req.body.dni;
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let email = req.body.email;
        let telefono = req.body.tel;
        let contraseña = req.body.contraseña;
        let fechaN = req.body.fechaN;
        let momfecha = moment(fechaN);
        let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');
        let resultado;
        const salt = await bcrypt.genSalt(10);
        let contra = await bcrypt.hash(contraseña, salt);
        try {
            const [results, metadata] = await sequelize.query(` CALL registrarCliente("${dni}", "${nombre}", "${apellido}", "${email}", "${telefono}", "${contra}", "${fecha}");`);
            resultado = results;
        } catch (e) {
            console.log(e);
        }
        req.flash(resultado.tipo, resultado.resultado);
        if (resultado.tipo == "error") {
            req.flash("dni", dni);
            req.flash("nombre", nombre);
            req.flash("apellido", apellido);
            req.flash("email", email);
            req.flash("telefono", telefono);
            req.flash("fecha", fechaN);
        }
        res.redirect('../');
    }
}
exports.cerrar = async(req, res, next) => {
    req.session.destroy();
    req.flash('mensaje', 'Se cerro la sesion');
    res.redirect('../');
}
exports.login = async(req, res, next) => {
    let cliente = await cli.findOne({
        where: {
            mail: req.body.email,
            estado: "aceptado"
        }
    });
    let empleado = await emp.findOne({
        where: {
            mail: req.body.email,
            estado: "activo"
        }
    });
    let area_gestion = await area.findOne({
        where: {
            nombre_area: "Gestion"
        }
    });
    let area_calidad = await area.findOne({
        where: {
            nombre_area: "Calidad"
        }
    });
    if (cliente) {
        const valida = await bcrypt.compare(req.body.contraseña, cliente.contraseña);
        if (valida) {
            req.session.usuario = cliente.dni;
            req.session.cliente = true;
            req.session.empleado = false;
            req.session.gestion = false;
            req.session.calidad = false;
            req.session.save();
            req.flash('mensaje', 'Se inicio sesion');
            res.redirect('../');;
        } else {
            req.flash('error', 'No se puedo iniciar sesion intente nuevamente');
            res.redirect('../');
        }
    } else if (empleado) {
        const valida = await bcrypt.compare(req.body.contraseña, empleado.contraseña);
        if (valida) {
            if (empleado.id_area == area_gestion.id_area) {
                req.session.usuario = empleado.dni;
                req.session.cliente = false;
                req.session.empleado = true;
                req.session.gestion = true;
                req.session.calidad = false;
                req.session.save();
                req.flash('mensaje', 'Se inicio sesion');
                res.redirect('../');

            } else if (empleado.id_area == area_calidad.id_area) {
                req.session.usuario = empleado.dni;
                req.session.cliente = false;
                req.session.empleado = true;
                req.session.gestion = false;
                req.session.calidad = true;
                req.session.save();
                req.flash('mensaje', 'Se inicio sesion');
                res.redirect('../');
            } else {
                req.session.usuario = empleado.dni;
                req.session.cliente = false;
                req.session.empleado = true;
                req.session.gestion = false;
                req.session.calidad = false;
                req.session.save();
                req.flash('mensaje', 'Se inicio sesion');
                res.redirect('../');
            }
        } else {
            req.flash('error', 'No se puedo iniciar sesion intente nuevamente');
            res.redirect('../');
        }
    } else {
        req.flash('error', 'No se puedo iniciar sesion intente nuevamente');
        res.redirect('../');
    }
};
exports.buscarTicket = async(req, res, next) => {
    let ticket = req.body.select;
    let dni = req.session.usuario;
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let calidad = req.session.calidad;
    let noti = await not.findAll({
        where: {
            estado: "no visto"
        }
    });
    let cantidad = noti.length;
    let solicitudes = await sol.findAll({
        where: {
            ticket: ticket
        }
    });
    if (solicitudes.length != 0) {
        let hisol = await his.findAll({
            include: [area],
            where: {
                id_solicitud: solicitudes[0].id_solicitud
            }
        });
        res.render("../views/ticket.pug", { cantidadN: cantidad, calidad: calidad, cliente: cliente, empleado: empleado, gestion: gestion, historiales: hisol, title: 'Help Desk', error: req.flash().error, mensaje: req.flash().mensaje });
    } else {
        req.flash('error', 'el ticket ingresado no corresponde a ninguna solicitud');
        res.redirect('../');
    }
}
exports.contraseñaUsuario = async(req, res, next) => {
    if (req.session.cliente) {
        let cliente = await cli.findByPk(req.session.usuario);
        const valida = await bcrypt.compare(req.body.contraseñaV, cliente.contraseña);
        if (valida) {
            let resultado;
            const salt = await bcrypt.genSalt(10);
            let contra = await bcrypt.hash(req.body.contraseñaN, salt);
            try {
                const { results, metadata } = await sequelize.query(` CALL cambiarContraCliente("${contra}","${cliente.dni}");`);
                resultado = results;
                console.log(resultado);
                req.flash(resultado.tipo, resultado.resultado);
            } catch (e) {
                console.log(e);
            }
            res.redirect('../');;
        } else {
            req.flash('error', 'La contraseña ingresa es invalida');
            res.redirect('../');
        }
    } else if (req.session.empleado) {
        let empleado = await emp.findByPk(req.session.usuario);
        const valida = await bcrypt.compare(req.body.contraseñaV, empleado.contraseña);
        if (valida) {
            const salt = await bcrypt.genSalt(10);
            let contra = await bcrypt.hash(req.body.contraseñaN, salt);
            let resultado;
            try {
                const { results, metadata } = await sequelize.query(` CALL cambiarContraEmpleado("${contra}","${empleado.dni}");`, { type: sequelize.QueryTypes.SELECT });
                resultado = results;

            } catch (e) {
                console.log(e);
            }
            req.flash("mensaje", "se cambio la contraseña con exito");
            res.redirect('../');;
        } else {
            req.flash('error', 'La contraseña ingresa es invalida');
            res.redirect('../');
        }
    } else {
        res.redirect('../');
    }
}