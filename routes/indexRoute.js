const express = require('express');
const indexRoute = express.Router();
const Story = require('../models/Story');
const {ensureAuth,ensuerUser} = require('../middlewear/Authenticate');


indexRoute.get('/', ensuerUser,(req,res)=>{
res.render('login',{layout:'login'});
});

indexRoute.get('/dashboard', ensureAuth , async (req,res)=>{
    try{
     const stories = await Story.find({user:req.user.id}).lean();
     res.render('dashboard',{name:req.user.firstName, stories:stories});
    }
    catch (err){
     console.error(err);
     res.render('erros/500');
    }

});

// indexRoute.get('*',(req,res)=>{
//     res.render('erros/404')
// })
module.exports=indexRoute;