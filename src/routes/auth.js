import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import { validateSingIn, validateForgotPassword, validateResetPassword } from "../validators/auth.js";
import { validateCreateUser } from "../validators/users.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post('/login', validateSingIn, authCtrl.logIn)
    .get('/isLogged', verifyToken, authCtrl.isLogged)
    .post('/logout', verifyToken, authCtrl.logOut)
    .post('/forgotPassword', validateForgotPassword, authCtrl.forgotPassword)
    .patch('/resetPassword/:resetToken', validateResetPassword, authCtrl.resetPassword) 
    .post('/signup', validateCreateUser, authCtrl.createUser) // crea un nuevo usuario

module.exports = router;