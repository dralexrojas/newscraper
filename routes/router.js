// Dependencies
var express    = require("express");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var router     = express.Router();
var exphbs     = require('express-handlebars');

// Requiring our Note and Article models
var Note    = require("../models/note.js");
var Article = require("../models/article.js");

// scraping tools
var cheerio = require("cheerio");
var request = require("request");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraper";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newscraper", { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});


db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// The root display route
router.get("/", function(req, res) {
  Article.find({}, null, {sort: {created: -1}}, function(err, data) {
    if(data.length === 0) {
      // First time to the / page, so redirect to /scrape to add some articles into the database
      res.redirect("/scrape");
    } else{
      
      res.redirect("/articles")
    }
  });
});


// The route to scrape the WP page
router.get("/scrape", function(req, res) {

  request("https://www.washingtonpost.com/", function(error, response, html) {

    const $ = cheerio.load(html);
    let titlesArray = [];

    $(".headline, .blurb").each(function(i, element) {
      let result = [];
      result.link = $(element).find("a").attr("href");
      result.title = $(element).find("a").text().trim();
      result.summary = $(element).find(".blurb").text().trim();
      
      let newArt = new Article(result);
      if (titlesArray.indexOf(result.title) === -1) {
        
        titlesArray.push(result.title);
        
        Article.count({ title: result.title}, function (err,dupeCheck){
          if (dupeCheck === 0) {
           
            let entry = new Article(result);
            entry.save(function(err,doc){
              if (err) {
                console.log(err);
              } else {
                
              }
            });
          } else {
            
          } 
        });
      } else {
       
      }
    });
  }, res.redirect("/articles"));
}); 



// A Route to Display all the articles in the database
router.get ('/articles', function (req, res){
 
  // Query MongoDB for all articles
  Article.find().sort({_id: -1})

    .populate('notes')

    .exec(function(err, doc){

      if (err){
        console.log(err);
      } 
      else {
        var expbsObject = {articles: doc};
        res.render('index', expbsObject);
      }
    });

});

// Get route to display all the comments
router.get('/display/comment/:id',function (req,res){
  
  var articleId = req.params.id; 
  res.redirect('/articles');

});

// Post route for adding comments to the db using the note model
router.post('/add/comment/:id', function (req, res){

 
  var articleId = req.params.id; 
  
  var noteAuthor = req.body.name;

  var noteContent = req.body.comment;

  var result = {
    author: noteAuthor,
    commentBody: noteContent
  };

 
  var entry = new Note (result);

  
  entry.save(function(err, doc) {
   
    if (err) {
      console.log(err);
    } 
    else {
      
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'notes':doc._id}}, {new: true})
      
      .exec(function(err, doc){
      
        if (err){
          console.log(err);
        } else {
          
          res.redirect("/articles");
        }
      });
    }
  });

});

// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res){

  var noteId = req.params.id;

  Note.findByIdAndRemove(noteId, function (err, todo) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      res.redirect("/articles");
    }

  });

});

// Export Router 
module.exports = router;