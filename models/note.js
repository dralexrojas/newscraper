var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor
var NoteSchema = new Schema({

  author: String,

  commentBody: String
});


var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;