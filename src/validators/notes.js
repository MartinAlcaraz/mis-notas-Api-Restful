import { body, param, query } from 'express-validator';
import validateResult from '../helpers/validate.helper.js';

const regExpObjectId = /[0-9a-f]{24}/;

const validateCreateNote = [

    body('title')
        .exists()
        .isString()
        .isLength({ min: 1, max: 50 }).withMessage('The title must be greater than 1 and less than 50 characters.'),

    body('description')
        .exists()
        .isString()
        .isLength({ min: 0, max: 2000 }).withMessage('The description must be  less than 2000 characters.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateGetOneNote = [

    param('id')
        .exists()
        .isString()
        .matches(regExpObjectId).withMessage("The param id is not a valid ObjectId"),

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
        .matches(regExpObjectId).withMessage("The param id is not a valid ObjectId"),

    body('title')
        .optional()
        .isString()
        .isLength({ min: 1, max: 50 }).withMessage('The title must be greater than 1 and less than 50 characters.'),

    body('description')
        .optional()
        .isString()
        .isLength({ min: 0, max: 2000 }).withMessage('The description must be less than 2000 characters.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
]

const validateDeleteNote = [

    param('id')
        .exists()
        .isString()
        .matches(regExpObjectId).withMessage("The param id is not a valid ObjectId"),
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