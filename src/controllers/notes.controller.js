import CustomError from "../Utils/CustomError";
import asyncErrorHandler from "../Utils/asyncErrorHandler";
import Nota from "../models/Nota";
import User from "../models/User";

const notesCtrl = {};

notesCtrl.updateSharedNote = asyncErrorHandler(async (req, res, next) => {

    const note_id = req.params.id;
    const shareNote = req.body.share;

    const note = await Nota.findById(note_id);

    if (!note) {
        const err = new CustomError("The note id given does not exist.", 400);
        return next(err);
    }

    note.shared = shareNote;

    const saved = await note.save()

    if (!saved) {
        const err = new CustomError("An error occurred while save the note.", 400);
        return next(err);
    }

    res.status(200).json({ status: 'OK', data: { message:"note updated!", note: saved } });

});

notesCtrl.getAllSharedNotes = asyncErrorHandler(async (req, res, next) => {
    
    const sharedNotes = await Nota.find({shared: true});
    console.log(sharedNotes)

    if (!sharedNotes) {
        const err = new CustomError("An error occurred while finding shared notes.", 400);
        return next(err);
    }

    res.status(200).json({ status: 'OK', data: { length: sharedNotes.length, sharedNotes: sharedNotes } });

});

notesCtrl.getAllNotes = asyncErrorHandler(async (req, res, next) => {

    const userId = req.user_id;

    const user = await User.findById(userId).select("notes");

    if (!user) {
        const err = new CustomError("The user id given does not exist.", 400);
        return next(err);
    }

    const notas = await user.populate("notes");

    if (!notas) {
        const err = new CustomError("An error occurred while retrieving the notes.", 400);
        return next(err);
    }

    res.status(200).json({ status: 'OK', data: { length: notas.notes.length, notes: notas.notes } });

});

notesCtrl.createNote = asyncErrorHandler(async (req, res, next) => {

    const { title, description } = req.body;

    const user = await User.findById(req.user_id);
    if (!user) {
        const err = new CustomError("The user does not exists.", 404);
        return next(err);
    }
    // create note in Nota collection
    const newNote = await Nota.create({ title, description, noteUpdatedAt: new Date(Date.now()) });

    if (!newNote) {
        const err = new CustomError("Could not create the note", 400);
        return next(err);
    }

    // push note.id in user.notes[]
    user.notes.push(newNote._id);
    const saved = await user.save();

    if (!saved) {
        const err = new CustomError("Could not push the note in the notes array", 400);
        return next(err);
    }

    res.status(201).json({ status: 'OK', message: 'Note created.', data: { newNote: newNote } });
});


notesCtrl.getOneNote = asyncErrorHandler(async (req, res, next) => {

    const note_id = req.params.id;

    const note = await Nota.findById(note_id)

    if (!note) {
        const err = new CustomError("The note doenst exist.", 400);
        return next(err);
    }

    res.status(200).json({ status: 'OK', data: { note } });

});

notesCtrl.updateNote = asyncErrorHandler(async (req, res, next) => {

    const { title, description } = req.body;
    const note_id = req.params.id;

    const note = await Nota.findById(note_id);

    if (!note) {
        const err = new CustomError("The note does not exists.", 404);
        return next(err);
    }

    if ( title == undefined && description == undefined ) {
        const err = new CustomError("Title or decription must exist in body request.", 400);
        return next(err);
    }

    const noteSaved = await Nota.findByIdAndUpdate(note_id, { title, description, noteUpdatedAt: new Date(Date.now()) },
        {
            runValidators: true,  // => para que se ejecuten los validadores del esquema de mongoose
            new: true  // =>  para que devuelva el registro nuevo, no el que fue actualizado
        }
    );

    if (!noteSaved) {
        const err = new CustomError("Could not update the note", 400);
        return next(err);
    }
    
    res.status(200).json({ status: 'OK', message: 'Note updated.', data: { newNote: noteSaved } });
});

notesCtrl.deleteNote = asyncErrorHandler(async (req, res, next) => {

    const note_id = req.params.id;

    const deletedNote = await Nota.findByIdAndDelete(note_id);
    
    if (!deletedNote) {
        const err = new CustomError("Could not delete the note because doesnt exist.", 400);
        return next(err);
    }

    const saved = await User.findByIdAndUpdate(req.user_id,
        {
            $pull: { "notes": note_id }   // remove the id note[] of User collection
        },
        {
            new: true   // return new record
        });

    if (!saved) {
        const err = new CustomError("Could not delete the id note", 400);
        return next(err);
    }

    res.status(200).json({ status: 'OK', message: 'Note deleted.', data: { deletedNote: deletedNote } });
});


notesCtrl.searchNote = null;

export default notesCtrl;