require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDatabase = require('./config/mongooseConfig');
const passportConfig = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const postsRoute = require('./routes/postsRoute');
const submitRoutes = require('./routes/submitRoutes');
const googleAuth=require('./routes/googleAuth');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors());


app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');


connectDatabase();


app.use(authRoutes);
app.use(postsRoute);
app.use(submitRoutes);
app.use(googleAuth);

app.get("/",(req,res)=>{
    res.render('home',{user:req.user});
})

app.get("/logout", (req, res) => {
    req.logOut(function(err) {
        if (err) {
            alert("Error logging out");
        }
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
