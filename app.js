const express=require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const Users=require('./models/user');
const passport=require('passport');
const expressSession=require('express-session');
const passportLocalMongoose=require('passport-local-mongoose');
const session = require('express-session');
const GoogleStrategy=require('passport-google-oauth20').Strategy;

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(session({
    secret:"qwertyuiop",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs');

async function main() {
    await mongoose.connect("mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.iiz1a.mongodb.net/secretsUserDB");   
}

main().catch(console.error);

passport.use(Users.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    Users.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
    res.render('home');
});


app.route("/login")
    .get(function(req,res){
        res.render('login');
    })
    .post(function(req,res){
        const user=new Users({
            username:req.body.username,
            password:req.body.password
        });
        req.logIn(user,function(err){
            if(err){
                res.redirect("/login");
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/secrets");
                });
            }
        })
    });

app.route("/register")
    .get(function(req,res){
        res.render('register');
    })
    .post(function (req,res) {
        Users.register({username:req.body.username},req.body.password,function(err,user){
            if(err){
                res.redirect("/register");
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/secrets");
                });
            }
        })
    })

app.route("/secrets")
    .get(async function(req,res){
       const usersSecrets=await Users.find({secret:{$ne:null}});
       res.render('secrets',{usersSecrets:usersSecrets});
    });

app.route("/logout")
    .get(function(req,res){
        req.logOut(function(err){
            if(err){
                alert("alert logging out");
            }
            res.redirect("/");
        });
        
    });

app.route("/auth/google")
    .get(passport.authenticate("google",{scope:["profile"]})
    );
        
app.route("/auth/google/secrets")
    .get(passport.authenticate("google",{failureRedirect:"/login"}),
    function(req,res){
        res.redirect("/secrets");
    }
    );

app.route("/submit")
    .get(function(req,res){
        if(req.isAuthenticated()){
            res.render('submit');
        }else{
            res.redirect('login');
        }
    })
    .post(async function(req,res){
        const secret=req.body.secret;
        await Users.findOneAndUpdate({_id:req.user.id},{secret:secret});
        res.redirect('secrets');
    })

app.listen( process.env.PORT || 3000,function(){
    console.log("server started at 3000");
});