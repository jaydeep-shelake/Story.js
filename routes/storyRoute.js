const express = require('express');
const storyRoute = express.Router();
const Story = require('../models/Story');
const {ensureAuth} = require('../middlewear/Authenticate');

// show add stories
//stories/add
storyRoute.get('/add', ensureAuth,(req,res)=>{
res.render('stories/add');
});
// process the add form
// post request to stories
storyRoute.post('/', ensureAuth,async (req,res)=>{
 try{
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
 }
 catch(err){
     console.log(err);
     res.render('erros/500')
 }
});

// show show single stories
//stories/id
storyRoute.get('/:id', ensureAuth,async(req,res)=>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user').lean();
        if(!story){
            return res.render('erros/404');
        }
        res.render('stories/singleStory',{story:story});
    } catch (err) {
         console.log(err);
         res.render('erros/404');
    }
});


//show the stories

storyRoute.get('/', ensureAuth, async (req,res)=>{
    try{
     const stories = await Story.find({status:'public'}).populate('user')
     .sort({createdAt:'desc'}).lean();
     res.render('stories/index',{stories:stories});
    }
    catch(err){
        console.log(err);
        res.render('erros/500');
    }
});

//show edit page
// /stories/edit/:id

storyRoute.get('/edit/:id',ensureAuth, async (req,res)=>{
    try {
        const story = await Story.findOne({_id:req.params.id}).lean();
       if(!story){
         return res.render('erros/404');
        }
 // if its not the story owner then user will not able to edit the stories
      if(story.user!= req.user.id){
         res.redirect('/stories');  
        }
      else{
         res.render('stories/edit',{story:story});
        }
    } catch (err) {
        console.error(err);
        return res.render('erros/500');
    }
 
});

//update a story
//put request stroies/id
storyRoute.put('/:id', ensureAuth,async (req,res)=>{
    //check story is there
    try{
        let story = await Story.findById(req.params.id).lean();
        if(!story){
            return res.render('erros/404');
        }
        if(story.user!= req.user.id){
            res.redirect('/stories');  
            }
            else{
                story = await Story.findByIdAndUpdate({_id:req.params.id}, req.body,{
                    new:true,
                    runValidators:true //check the mongoose flied are valid
                });
                res.redirect('/dashboard');
            }
    }
    catch(err){
        console.error(err);
        return res.render('erros/500');
    }
});
//delet story
// DELETE /stories/:id

storyRoute.delete('/:id',ensureAuth,async (req,res)=>{
try{
await Story.remove({_id:req.params.id});
res.redirect('/dashboard');
}
catch(err){
console.error(err);
return res.render('erros/500');
}
});

// more user stories
//get request to stories/user/:id
storyRoute.get('/user/:userId', ensureAuth,async (req,res)=>{
    
try{
  const stories = await Story.find({
      user:req.params.userId,
      status:'public',
  })
  .populate('user').lean();
  res.render('stories/index',{stories:stories})
}
catch(err){
  console.log(err);
  res.render('erros/500');
}
 });

module.exports=storyRoute;