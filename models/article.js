var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: "No Summary Available"
  },
  img: {
    type: String,
    default: "/assets/images/wplogo.jpeg"
  },
  issaved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Save Article",
  },
  created: {
    type: Date,
    default: Date.now
  },

  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

ArticleSchema.index({title: "text"});
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;