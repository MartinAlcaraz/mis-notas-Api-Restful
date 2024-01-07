import express from "express";
import userCtrl from "../controllers/user.controller.js";
// import { validateUpdateUser, validateDeleteUser, validateCreateUser, validateParamUsername } from '../validators/users.js';
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get('/', [verifyToken], userCtrl.getOneUser) // retorna los datos del usuario logueado.
    // .get('/:username', [verifyToken, validateParamUsername ], userCtrl.getOneUser) // retorna 1 usario
    // .put('/', [ verifyToken, validateUpdateUser], userCtrl.updateUser) // comprueba el password actual y actualiza el username y password. La actualizacion la hace el usuario logueado.
    // .delete('/', [ verifyToken , isAdmin, validateDeleteUser], userCtrl.deleteUser); // elimina 1 usuario

module.exports = router;