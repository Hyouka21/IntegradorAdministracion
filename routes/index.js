var express = require('express');
var router = express.Router();
const ini = require("../controladores/controladorInicio");
let EstaAutenticado = function(req, res, next) {
    if (req.session.usuario) return next();
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("../");
};
router.get('/', (req, res, next) => ini.inicio(req, res, next));
router.post('/login', (req, res, next) => ini.login(req, res, next));
router.post('/cerrar', (req, res, next) => ini.cerrar(req, res, next));
router.post('/registro', (req, res, next) => ini.registrar(req, res, next));
router.post('/tickets', (req, res, next) => ini.buscarTicket(req, res, next));
router.post('/cambiarContra', (req, res, next) => ini.contraseñaUsuario(req, res, next));



module.exports = router;