import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { validateCreateNote, validateGetOneNote, validateGetAllNotes, validateUpdateNote, validateDeleteNote, validateShareNote } from "../validators/notes.js"
import notesCtrl from "../controllers/notes.controller.js";

const router = express.Router();

router.get('/shared', verifyToken, notesCtrl.getAllSharedNotes)
    .put('/shared/:id', [verifyToken, validateShareNote], notesCtrl.updateSharedNote)
    .get('/', [verifyToken, validateGetAllNotes], notesCtrl.getAllNotes)
    .post('/', [verifyToken, validateCreateNote], notesCtrl.createNote)
    .get('/:id', [verifyToken, validateGetOneNote], notesCtrl.getOneNote)
    .put('/:id', [verifyToken, validateUpdateNote], notesCtrl.updateNote)
    .delete('/:id', [verifyToken, validateDeleteNote], notesCtrl.deleteNote)


// .get('/', validateSearchNote, notesCtrl.searchNote);

module.exports = router;