var express = require('express');
var router = express.Router();
const emp = require("../controladores/controladorEmpleado");
let esEmpleadoGestion = function(req, res, next) {
    if (req.session.gestion) return next();
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("/");
};
let esEmpleadoCalidad = function(req, res, next) {
    if (req.session.calidad) return next();
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("/");
};
/* GET users listing. */
router.get('/', (req, res, next) => emp.inicioEmpleado(req, res, next));
router.post('/resolver', (req, res, next) => emp.resolverEmpleado(req, res, next));
router.post('/resolver/solucionar', (req, res, next) => emp.solucionarEmpleado(req, res, next));
router.post('/resolver/transferir', (req, res, next) => emp.transferirEmpleado(req, res, next));
router.post('/gestion/registrar', esEmpleadoGestion, (req, res, next) => emp.registrarEmpleado(req, res, next));
router.post('/gestion/modificar', esEmpleadoGestion, (req, res, next) => emp.modificarEmpleado(req, res, next));
router.post('/gestion/modificar/update', esEmpleadoGestion, (req, res, next) => emp.updateEmpleado(req, res, next));
router.post('/gestion/eliminar', esEmpleadoGestion, (req, res, next) => emp.eliminarEmpleado(req, res, next));
router.post('/gestion/activar', esEmpleadoGestion, (req, res, next) => emp.activarEmpleado(req, res, next));
router.post('/gestion/eliminarArea', esEmpleadoGestion, (req, res, next) => emp.eliminarArea(req, res, next));
router.post('/gestion/crearArea', esEmpleadoGestion, (req, res, next) => emp.crearArea(req, res, next));
router.post('/gestion/aceptarCliente', esEmpleadoGestion, (req, res, next) => emp.aceptarCliente(req, res, next));
router.post('/gestion/desactivarCliente', esEmpleadoGestion, (req, res, next) => emp.desactivarCliente(req, res, next));
router.get('/gestion', esEmpleadoGestion, (req, res, next) => emp.gestion(req, res, next));
router.get('/notificaciones', esEmpleadoCalidad, (req, res, next) => emp.notificacionesCalidad(req, res, next));
router.post('/notificaciones/visto', esEmpleadoCalidad, (req, res, next) => emp.notificacionesVistas(req, res, next));
router.post('/gestion/modificarArea', esEmpleadoGestion, (req, res, next) => emp.modificarArea(req, res, next));
let EstaAutenticado = function(req, res, next) {
    if (req.session.empleado) return next();
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("/");
};


module.exports = router;
module.exports.EstaAutentEmpleado = EstaAutenticado;