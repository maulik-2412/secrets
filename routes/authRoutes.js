const express = require('express');
const passport = require('passport');
const Users = require('../models/user');
const router = express.Router();

router.get("/login", (req, res) => {
    res.render('login');
});

router.post("/login", (req, res) => {
    const user = new Users({
        username: req.body.username,
        password: req.body.password
    });
    req.logIn(user, function(err) {
        if (err) {
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/posts");
            });
        }
    });
});

router.get("/register", (req, res) => {
    res.render('register');
});

router.post("/register", (req, res) => {
    
    const role = req.body.role;
    if (!['viewer', 'moderator', 'admin'].includes(role)) {
        console.log("Invalid role provided");
        return res.redirect("/register");
    }
    console.log(req.body)
    Users.register({ username: req.body.username,role:req.body.role }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/posts");
            });
        }
    });
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/auth/google/secrets", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/secrets");
    }
);

module.exports = router;
