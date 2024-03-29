import { Schema, model } from 'mongoose';

const notaSchema = new Schema({
    title: {
        type: String, 
        required: false, 
        unique: false, 
        trim: true,
        minlength: [0, "El titulo puede tener 0 caracteres."],
        maxlength: [50, "El titulo debe tener 50 caracteres o menos."]
    },
    description: { 
        type: String, 
        trim: true,
        minlength: [0, "La descripcion puede tener 0 caracteres."], 
        maxlength : [2000, "La descripcion debe tener 2000 caracteres o menos."]
    },
    // only updates date when note text changes
    noteUpdatedAt : { type: Date, required: true},
    shared: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: false,
    versionKey: false // en cada creacion de objeto no se guarda la version __v
});

// Document Middleware:
// function executed before .save() or .create() methods in product.controller, executed before the document is saved in DDBB
notaSchema.pre('save', function (next) {
    // this.description = `Delicious ${this.name}`;
    // console.log('document middleware in save or create method');
    next();
});

// execute after the document has been created with save or create methods.
notaSchema.post('save', function (doc, next) {
    // const text = 'The document "' + doc.title + '" has been created';
    // console.log('post save ');
    next();
});

export default model("Nota", notaSchema); 