const express = require('express');
const Posts = require('../models/posts');
const router = express.Router();
const checkRole=require('../middleware/roleMiddleware');

router.get("/posts",checkRole(['admin','moderator','viewer'], 'At least viewer role required'), async (req, res) => {
        if(req.isAuthenticated()){
                const posts = await Posts.find({});
                res.render('posts', { posts: posts });
        }else{
                res.redirect('/login');
        }
        
});

router.get("/posts/:id",checkRole(['admin','moderator','viewer'],'Need admin permission'),async (req,res)=>{
        const post=await Posts.findById(req.params.id);
        res.render('postFull',{post:post});
})

router.delete("/posts/:id",checkRole(['admin'],'Need admin permissions'),async(req,res)=>{
        
        try {
                await Posts.deleteOne({ _id: req.params.id });
                res.status(200).json({ message: 'Post deleted successfully' });

                
            } catch (error) {
                console.error("Error deleting post:", error);
                res.status(500).json({ message: "Failed to delete post. Please try again later." });
            }
})

router.get("/posts/edit/:id",checkRole(['admin'],'Need admin permissions'),async(req,res)=>{
        if(req.isAuthenticated()){
                const post=await Posts.findById(req.params.id);
                res.render('editPost',{post:post});
        }else{
                res.redirect('/login');
        }
})

router.patch("/posts/edit/:id",checkRole(['admin'],'Need admin permissions'),async(req,res)=>{
        try {
                const updatedPost = await Posts.findByIdAndUpdate(
                    req.params.id, 
                    { $set: req.body }, 
                    { new: true } 
                );
                console.log(req.body);

                if (!updatedPost) {
                    return res.status(404).json({ message: "Post not found" });
                }
        
                res.status(200).json({ message: "Post updated successfully", post: updatedPost });
            } catch (error) {
                console.error("Error updating post:", error);
                res.status(500).json({ message: "Internal server error" });
            }
})

module.exports = router;
