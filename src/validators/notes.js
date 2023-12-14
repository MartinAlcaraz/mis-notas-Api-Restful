import { body, param, query } from 'express-validator';
import validateResult from '../helpers/validate.helper.js'

const validateCreateNote = [

    // body("userId")
    //     .exists().withMessage("userId property must exists.")
    //     .isString()
    //     .isLength({ min: 24, max: 24 }).withMessage("The userId debe tener 24 caracteres"),

    body('title')
        .exists()
        .isString()
        .isLength({ min: 3, max: 50 }).withMessage('The title must be greater than 3 and less than 50 characters.'),

    body('description')
        .exists()
        .isString()
        .isLength({ min: 3, max: 2000 }).withMessage('The description must be greater than 3 and less than 2000 characters.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateGetOneNote = [

    param('id')
        .exists()
        .isString()
        .isLength({ min: 24, max: 24 }).withMessage('The userId must be an ID'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateGetAllNotes = [

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateUpdateNote = [

    param('id')
        .exists()
        .isString()
        .isLength({ min: 24, max: 24 }).withMessage('The param must be an ID'),

    body('title')
        .exists()
        .isString()
        .isLength({ min: 3, max: 50 }),

    body('description')
        .exists()
        .isString()
        .isLength({ min: 3, max: 2000 }).withMessage('The description must be greater than 3 and less than 2000 characters.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateDeleteNote = [

    param('id')
        .exists()
        .isString()
        .isLength({ min: 24, max: 24 }).withMessage('The param must be an ID'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateSearchNote = [
    query('title')
        .exists().withMessage("Query 'title' must exists.")
        .isString()
        .isLength({ min: 1, max: 30 }).withMessage("The name must be greater than 1 and less than 30 characters."),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]


module.exports = {
    validateCreateNote, validateGetOneNote, validateGetAllNotes,
    validateUpdateNote, validateDeleteNote, validateSearchNote
};