const express = require('express');
const Users = require('../models/user');
const router = express.Router();
const checkRole=require('../middleware/roleMiddleware');
const Posts=require('../models/posts');

router.get("/submit", checkRole(['admin','moderator'],'At least Moderator role required'),  (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect("/login");
    }
});

router.post("/submit", async (req, res) => {
    const {title,body} = req.body;
    await Posts.create({title:title,body:body});
    res.redirect("/posts");
});

module.exports = router;
