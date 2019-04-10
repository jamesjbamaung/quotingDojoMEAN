// Load the express module and store it in the variable express (Where do you think this comes from?)
var express = require("express");
console.log("Let's find out what express is", express);
// invoke express and store the result in the variable app
var app = express();
console.log("Let's find out what app is", app);
// use app's get method and pass it the base route '/' and a callback

//linking static folder
app.use(express.static(__dirname + "/static"));

//linking views folder and importing ejs (the view engine)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//importing and installing body-parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));

//importing and installing express-session
var session = require('express-session');

app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

//importing and installing flash
const flash = require('express-flash');
app.use(flash());


//importing and installing mongoose
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quotingDojo');

//creating a user database
var QuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2},
    quoteContent: { type: String, required: true, minlength: 10 },
}, {timestamps: true });
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'

// Use native promises (only necessary with mongoose versions <= 4)
mongoose.Promise = global.Promise;



app.get('/', function (request, response) {
    response.render('index');
})

app.post('/addquote', function (req, res){
    var quote = new Quote(req.body);
    quote.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/quote');
        }
        else {
            res.redirect('/quote');
        }
    });
});

app.get('/quote', function(req, res){
    Quote.find({}, function(err, quotes){
        if(err){
            console.log("error");
        }
        else {
            res.render('quote', {quotes: quotes});
        }
    })
});

// This is the route that we already have in our server.js
// When the user presses the submit button on index.ejs it should send a post request to '/users'.  In
//  this route we should add the user to the database and then redirect to the root route (index view).
// app.post('/users', function (req, res) {
//     console.log("POST DATA", req.body);
//     console.log("hit the user post route");
//     // create a new User with the name and age corresponding to those from req.body
//     var user = new User({ name: req.body.name, age: req.body.age });
//     // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
//     user.save(function (err) {
//         // if there is an error console.log that something went wrong!
//         if (err) {
//             console.log('something went wrong');
//         } else { // else console.log that we did well and then redirect to the root route
//             console.log('successfully added a user!');
//         }
//         res.redirect('/');
//     })
// })


// app.post('/counter', function (req, res) {
//     req.session.counter++;
//     res.redirect('/');
// });
// app.post('/reset', function (req, res) {
//     req.session.counter = 0;
//     res.redirect('/');
// })

// app.post('/users', function (req, res){
//     console.log("POST DATA \n\n", req.body)
//     // set the name property of session.  
//     req.session.name = req.body.name;
//     console.log(req.session.name);
//     //code to add user to db goes here!
//     // redirect the user back to the root route. 
//     res.redirect('/');
// });
// app.post('/users', function (req, res){
//     console.log("POST DATA \n\n", req.body)
//     //code to add user to db goes here!
//     // redirect the user back to the root route.  
//     res.redirect('/')
// });
// app.get("/users/:id", function (req, res){
//     console.log("The user id requested is:", req.params.id);
//     // just to illustrate that req.params is usable here:
//     res.send("You requested the user with id: " + req.params.id);
//     // code to get user from db goes here, etc...
// });

// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(8000, function () {
    console.log("listening on port 8000");
})