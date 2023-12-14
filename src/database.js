import mongoose from "mongoose";
import dotenv from "dotenv";

let mongodb_uri;

dotenv.config();
// console.log('MONGO_DB_URI: ',process.env.MONGO_DB_URI);

if(process.env.NODE_ENV == "development") {
    // mongodb_uri = "mongodb://localhost/mis-notas";
    mongodb_uri = process.env.MONGO_DB_URI_LOCAL;
}else{
    mongodb_uri= process.env.MONGO_DB_URI;
}

mongoose.connect(mongodb_uri)
.then( (db) =>{console.log("Database is connected to \n" , mongodb_uri) })
// .catch( (error) => console.log("Error, database is not connected :(  \n", error));