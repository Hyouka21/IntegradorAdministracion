var express = require('express');
var router = express.Router();
const cli = require("../controladores/controladorCliente");
router.get('/', (req, res, next) => cli.inicioCliente(req, res, next));
router.post('/crear', (req, res, next) => cli.crearCliente(req, res, next));
let EstaAutenticado = function(req, res, next) {
    if (req.session.cliente) return next();
    // si el usuario no esta autenticado entonces lo redirigimos a donde tengo el login
    res.redirect("/");
};
module.exports = router;
module.exports.EstaAutentCliente = EstaAutenticado;