import User from "../models/User.js";
import Rol from "../models/Rol.js"
import createToken from "../Utils/createToken.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import mail from "../Utils/email.js";
import crypto from 'crypto';
import CustomError from "../Utils/CustomError.js";

const authCtrl = {};

authCtrl.createUser = asyncErrorHandler(async (req, res, next) => {

    const { username, email, password } = req.body;

    const usernameFound = await User.find({ username: new RegExp('^'+username+'$', 'i') });

    // comprueba si ya existe un usuario con el username ingresado
    if (usernameFound.length > 0) {
        const err = new CustomError("The username alredy exists, use another.", 409);
        return next(err);
    }
    
    const usermailFound = await User.find({ email: email });

    // comprueba si ya existe un usuario con el email ingresado
    if (usermailFound.length > 0) {
        const err = new CustomError("The email alredy exists, use another.", 409);
        return next(err);
    }

    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
        const err = new CustomError("Could not create user.", 400);
        return next(err);
    }
    
    res.status(201).json({ status: "OK", message: `User ${savedUser.username} created!` });

});

// email, password
authCtrl.logIn = asyncErrorHandler(async (req, res) => {

    const foundUser = await User.findOne({ email: req.body.email }).select("+password");
    if (!foundUser) {
        return res.status(401).json({ status: "FAILED", message: "Invalid email or password" });
    }

    const validPassword = await User.comparePassword(req.body.password, foundUser.password);

    if (!validPassword) {
        return res.status(401).json({ status: "FAILED", message: "Invalid email or password" });
    }
    // (user id , expiration in seconds); 1hour == 3600 seconds
    const token = createToken(foundUser._id, 3600); 
    
    const user = {
        username: foundUser.username,
    }

    res.cookie('access-token', token, {
        httpOnly: true,
        sameSite: 'none' ,
        secure: "true", //process.env.NODE_ENV == "production", // for cookies enables in client side
        maxAge: 3600 * 1000, // 60 minutos en milisegundos
    })
        .status(200).json({ status: "OK", message: "Successful login ", data: { user } });

});

authCtrl.isLogged = asyncErrorHandler(async (req, res) => {
    
    res.status(200).json({ status: "OK", message: "Successful login", data: {isLogged: true} });
});

authCtrl.logOut = async (req, res) => {
    res.clearCookie('access-token');
    res.status(200).json({ status: "OK", message: "Successful logout", data: null }).end();  // end()
}

// send an email at the user to reset the password
authCtrl.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "The user email does not exists." });
        }

        // create token for reset password
        const resetToken = user.createResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        //    send Email      //
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;

        const message = `We have recieved a password reset request. 
            Please use the link below to reset the password. \n\n ${resetURL} \n\n
            This reset password link will be available only for 10 minutes.`;

        try {
            const mailOptions = {
                from: "RestoMartinMenuOnline support<alcarazangelmartin@gmail.com>",
                // to: user.email, // <====
                to: "martincho_cqc@hotmail.com",
                subject: "Password reset request",
                text: message,
                html: `
                    <p>We have recieved a password reset request. Please use the link below to reset the password.</p>
                    <a href="${resetURL}">Reset Password</a>
                    <p>This reset password link will be available only for 10 minutes.</p>
                    `
            }
            await mail.sendMail(mailOptions);

            return res.status(200).json({ status: "OK", message: "Password reset link send to the user email." });

        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.log("err", err);
            return res.status(500).json({ status: "FAILED", message: "There was a problem with the reset password email. Try again later." });
        }

    } catch (error) {
        return res.status(500).json({ status: "FAILED", message: "Error in password reset controller" });
    }
}

authCtrl.resetPassword = async (req, res, next) => {
    const encryptedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({ encryptedPasswordResetToken: encryptedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(401).json({ status: "FAILED", message: "The token is invalid or has expired." });
    }

    user.password = await User.encryptPassword(req.body.newPassword);
    user.encryptedPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({ status: "OK", message: "Password has changed. Please login again." });
}

export default authCtrl;