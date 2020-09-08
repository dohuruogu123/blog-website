//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Simple blog page with functionality built in by myself. Place just to be alone with my thoughts, with musings on how things go on in this world";
const aboutContent = "Random guy, nothing particularly special about me";
const contactContent = "YOU'LL SEE ME WHEN YOU SEE ME";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-daniel:testmongo@cluster0.4peex.mongodb.net/blogpostsDB", {useNewUrlParser: true, useUnifiedTopology: true});
//got my new MongoDB online connection
//let posts = [];

const postSchema = {
  title: String,
  content: String
}; //outlined schema for new documents

const Post = mongoose.model("Post", postSchema); //new collection to be called 'posts'

app.get("/", function(req, res){ //need to find all the documents in collection
  const posts = Post.find({}, function(err, posts){
    console.log(posts.title);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts //array is passed through with a value to the other side
      });
  }); //used find to read them
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){ //need to create a new document
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  }); //created a new document with what comes through the POST request

  post.save(function(err){ //saves created document to the collection
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, foundPost){ //look for posts in collection
    if (!err) {
   //if there's a match between reqTitle and foundTitle
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    } else {
      console.log(err);
    }
  });
}); // THINK I'VE BOTCHED THIS, WILL SEE HOW IT WORKS

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT; //some mechanism to get the Mongo Atlas ting to see our port, somehow. Weren't paying too much attention to this
if (port == null || port == "") {
  port = 3000; //ooohh, if there's no internet connection, just switch to local port 3000 (I think)
};

app.listen(port, function() {
  console.log("Server started successfully");
});
// I don't like that a part of the functionality was changed. I personally would like to see a method
//that incorporates the way of just typing in the blog title and going directly to that page
