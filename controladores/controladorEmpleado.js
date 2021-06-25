const area = require("../models").Area;
const his = require("../models").Historial;
const sol = require("../models").Solicitud;
const emp = require("../models").Empleado;
const cli = require("../models").Cliente;
const sequelize = require("../models/index").sequelize;
const not = require("../models").Notificacion;
const { Op } = require("sequelize");
const moment = require('moment');
const bcrypt = require("bcrypt");
exports.inicioEmpleado = async(req, res, next) => {
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
    const pers = await emp.findByPk(dni);
    let hisol = await his.findAll({
        include: [sol],
        where: {
            id_area: pers.id_area,
            estado: "pendiente"
        }
    });

    res.render("../views/empleado/empleado.pug", {
        pretty: true,
        his: hisol,
        cliente: cliente,
        empleado: empleado,
        gestion: gestion,
        calidad: calidad,
        cantidadN: cantidad,
        error: req.flash().error,
        mensaje: req.flash().mensaje
    });

};
exports.resolverEmpleado = async(req, res, next) => {
    let dni = req.session.usuario;
    let emp1 = await emp.findByPk(dni);
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let arr1 = "" + req.body.select;
    let arr = arr1.split("/");
    let calidad = req.session.calidad;
    let noti = await not.findAll({
        where: {
            estado: "no visto"
        }
    });
    let cantidad = noti.length;
    let historiales;
    let areas;
    let hisol;
    try {
        hisol = await his.findAll({
            include: [sol, area],
            where: {
                fecha_ingreso: arr[0],
                id_area: arr[1],
                id_solicitud: arr[2]
            }
        });
        historiales = await his.findAll({
            include: [sol, area],
            where: {
                id_solicitud: arr[2]
            }
        });
        areas = await area.findAll({

            where: {
                estado: "activo",
                [Op.not]: {
                    id_area: emp1.id_area
                }
            }
        });
    } catch (e) {
        console.log(e)
    }

    res.render("../views/empleado/resolver.pug", {
        his: hisol,
        areas: areas,
        historiales: historiales,
        cliente: cliente,
        empleado: empleado,
        gestion: gestion,
        calidad: calidad,
        cantidadN: cantidad,
        error: req.flash().error,
        mensaje: req.flash().mensaje
    })
};
exports.transferirEmpleado = async(req, res, next) => {
    let dni = req.session.usuario;
    let motivo = req.body.motivo;
    let prioridad = req.body.prioridad;
    let areanueva = req.body.area;
    let arr1 = "" + req.body.select;
    let arr = arr1.split("/");
    let resultado;
    if (prioridad != null) {
        try {
            const [results, metadata] = await sequelize.query(` CALL priorizarSolicitud("${arr[2]}", "${prioridad}");`);

        } catch (e) {
            console.log(e);
        }
    }
    // mira el quilombo que hay que hacer para parsear una fecha jajaj
    let momfecha = moment(arr[0]);
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');
    try {
        const [results, metadata] = await sequelize.query(` CALL transferirHistorial("${fecha}", "${arr[1]}", "${arr[2]}", "${dni}", "${motivo}", "${areanueva}");`);
        resultado = results;
        console.log(resultado);
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../');
}
exports.registrarEmpleado = async(req, res, next) => {
    let dni = req.body.dni;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let email = req.body.email;
    let telefono = req.body.tel;
    let contraseña = req.body.contraseña;
    let area = req.body.area;
    let fechaN = req.body.fechaN;
    let momfecha = moment(fechaN);
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');
    const salt = await bcrypt.genSalt(10);
    let contra = await bcrypt.hash(contraseña, salt);
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(` CALL registrarEmpleado("${dni}", "${nombre}", "${apellido}", "${email}", "${telefono}", "${contra}", "${area}","${fecha}");`);
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
        req.flash("area", area);
        req.flash("fecha", fechaN);
    }
    res.redirect('../gestion');

}
exports.solucionarEmpleado = async(req, res, next) => {
    let dni = req.session.usuario;
    let solucion = req.body.resolucion;
    let arr = req.body.select.split("/");
    let resultado;
    let hisol = await his.findAll({
        include: [sol],
        where: {
            fecha_ingreso: arr[0],
            id_area: arr[1],
            id_solicitud: arr[2]
        }
    });
    // mira el quilombo que hay que hacer para parsear una fecha jajaj
    let momfecha = moment(hisol[0].fecha_ingreso);
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');

    try {
        const [results, metadata] = await sequelize.query(` CALL resolverHistorial("${fecha}", "${hisol[0].id_area}", "${hisol[0].id_solicitud}", "${dni}", "${solucion}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../');
}
exports.gestion = async(req, res, next) => {
    let dni = req.session.usuario;
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let areas = await area.findAll({

        where: {
            estado: "activo",
            id_area: {
                [Op.notIn]: [1, 2, 4]
            }
        }
    });
    let clientes = await cli.findAll();
    let empleados = await emp.findAll({
        include: [area],
        where: {
            [Op.not]: {
                dni: dni
            }
        }
    });
    let registro;
    if (req.flash().dni != undefined) {
        let dniR = req.flash().dni;
        let nombreR = req.flash().nombre;
        let apellidoR = req.flash().apellido;
        let emailR = req.flash().email;
        let telefonoR = req.flash().telefono;
        let fechaR = req.flash().fecha;
        let areaR = req.flash().area;
        registro = { "area": areaR, "fecha": fechaR, "telefono": telefonoR, "email": emailR, "apellido": apellidoR, "nombre": nombreR, "dni": dniR, }
    }
    console.log(registro);
    res.render("../views/empleado/gestion.pug", {
        areas: areas,
        clientes: clientes,
        empleados: empleados,
        cliente: cliente,
        empleado: empleado,
        gestion: gestion,
        error: req.flash().error,
        mensaje: req.flash().mensaje,
        registro: registro
    })
};
exports.modificarArea = async(req, res, next) => {
    let area = req.body.select;
    let nombre = req.body.nombre;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL modificarArea("${area}", "${nombre}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../../empleado/gestion');
}
exports.modificarEmpleado = async(req, res, next) => {
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let dni = req.body.select;
    let empleados = await emp.findByPk(dni);

    let areas = await area.findAll({

        where: {
            estado: "activo"
        }
    });
    let momfecha = moment(empleado.fecha);
    let fecha = momfecha.format('YYYY-MM-DD');
    res.render("../views/empleado/modificar.pug", {
        areas: areas,
        empleados: empleados,
        fecha: fecha,
        cliente: cliente,
        empleado: empleado,
        gestion: gestion,
        error: req.flash().error,
        mensaje: req.flash().mensaje
    });
}
exports.updateEmpleado = async(req, res, next) => {
    let dni = req.body.dni;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let email = req.body.email;
    let telefono = req.body.tel;
    let area = req.body.area;
    let fechaN = req.body.fechaN;
    let momfecha = moment(fechaN);
    let fecha = momfecha.format('YYYY-MM-DD HH:mm:ss');
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL modificarEmpleado("${dni}", "${nombre}", "${apellido}", "${email}", "${telefono}", "${area}", "${fecha}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../');
}
exports.eliminarEmpleado = async(req, res, next) => {
    let dni = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL darBajaEmpleado("${dni}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.activarEmpleado = async(req, res, next) => {
    let dni = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL darAltaEmpleado("${dni}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.eliminarArea = async(req, res, next) => {
    let id = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL eliminarArea("${id}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.crearArea = async(req, res, next) => {
    let nombre = req.body.nombre;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL insertarArea("${nombre}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.aceptarCliente = async(req, res, next) => {
    let dni = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL aceptarCliente("${dni}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.desactivarCliente = async(req, res, next) => {
    let dni = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL desactivarCliente("${dni}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../gestion');
}
exports.notificacionesCalidad = async(req, res, next) => {
    let hist = [];
    let noti = await not.findAll();
    let cliente = req.session.cliente;
    let empleado = req.session.empleado;
    let gestion = req.session.gestion;
    let calidad = req.session.calidad;
    console.log(noti);
    let notifi = await not.findAll({
        where: {
            estado: "no visto"
        }
    });
    let cantidad = notifi.length;
    for (valor in noti) {
        let hisol = await his.findAll({
            include: [sol, area],
            where: {
                id_solicitud: noti[valor].id_solicitud,
            }
        });
        hist.push(hisol)
    }
    res.render("../views/empleado/notificacion.pug", {
        historial: hist,
        notificacion: noti,
        cliente: cliente,
        empleado: empleado,
        gestion: gestion,
        calidad: calidad,
        error: req.flash().error,
        mensaje: req.flash().mensaje,
        cantidadN: cantidad
    });

}
exports.notificacionesVistas = async(req, res, next) => {
    let idN = req.body.select;
    let resultado;
    try {
        const [results, metadata] = await sequelize.query(`CALL vistoNoti("${idN}");`);
        resultado = results;
    } catch (e) {
        console.log(e);
    }
    req.flash(resultado.tipo, resultado.resultado);
    res.redirect('../../empleado/notificaciones');
}