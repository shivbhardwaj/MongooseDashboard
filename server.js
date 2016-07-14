// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/mongoose_dashboard');
var RabbitSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('rabbit', RabbitSchema);
var Rabbit = mongoose.model('rabbit')

//GET route 1 for all rabbits, index.ejs
app.get('/', function(req, res) {
    Rabbit.find({}, function(err, rabbits){
      if(err){
        console.log("Something went wrong");
      }
      else{
        console.log("found rabbits successfully");
        console.log(rabbits);
        res.render('index', {rabbits:rabbits});
      }
    })
});

//GET route 3 for NEW rabbit form, new.ejs
app.get('/rabbit/new', function(req, res){
  console.log("am I hitting the new route???");
  res.render('new');
});

//POST route 4 to add a new rabbit.
app.post('/rabbits', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var rabbit = new Rabbit({name: req.body.name, age: req.body.age});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  console.log(rabbit);
  rabbit.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a rabbit!');
      res.redirect('/');
    }
  })
});

//GET route 5 for rabbit by id, show.ejs
app.get('/rabbit/:id/edit', function(req, res){
  Rabbit.findOne({_id:req.params.id}, function(err, rabbit){
    if(err){
      console.log("rabbit/:id/edit error ", err);
    }
    else{
      res.render('edit',{rabbit:rabbit});
    }
  })
});

//POST route 6 to add a new rabbit.
app.post('/rabbits/:id/update', function(req, res) {
  console.log("POST DATA", req.body);
  //Rabbit.update
  Rabbit.findOne({_id:req.params.id}, function(err, rabbit){
    rabbit.name = req.body.name;
    rabbit.age = req.body.age;
    console.log(rabbit.name, " is the new name");
    console.log(rabbit.age, " is the new age");
    rabbit.save(function(err) {
      if(err) {
        console.log('something went wrong');
      }
      else { // else console.log that we did well and then redirect to the root route
        console.log('successfully updated a rabbit!');
        console.log(rabbit);
        res.redirect('/');
      }
    })
  })
});

//POST route 7 to delete rabbit by ID
app.post('/rabbits/:id/destroy', function(req, res){
  Rabbit.remove({_id:req.params.id}, function(err, rabbit){
    if(err){
      console.log("rabbits/:id/destroy error ", err);
    }
    else{
      console.log("RABBIT DELETED OMG ", req.params.id);
      res.redirect('/');
    }
  })
});

//GET route 2 for rabbit by id, show.ejs
app.get('/rabbit/:id', function(req, res){
  Rabbit.findOne({_id:req.params.id}, function(err, rabbit){
    if(err){
      console.log("rabbit/:id error ", err);
    }
    else{
      res.render('show',{rabbit:rabbit});
    }
  })
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
