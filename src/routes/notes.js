import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { validateCreateNote, validateGetOneNote, validateGetAllNotes, validateUpdateNote, validateDeleteNote } from "../validators/notes.js"
import notesCtrl from "../controllers/notes.controller.js";

const router = express.Router();

router.get('/', [ verifyToken, validateGetAllNotes ], notesCtrl.getAllNotes)
    .get('/:id',[ verifyToken,validateGetOneNote ] ,notesCtrl.getOneNote)
    .post('/', [ verifyToken, validateCreateNote ], notesCtrl.createNote)
    .put('/:id', [ verifyToken, validateUpdateNote ], notesCtrl.updateNote)
    .delete('/:id', [ verifyToken, validateDeleteNote ], notesCtrl.deleteNote)
    // .get('/', validateSearchNote, notesCtrl.searchNote);

module.exports = router;