

module.exports={
    ensureAuth:(req,res,next)=>{
      if(req.isAuthenticated()){
          return next();
      }
      else{
          res.redirect('/');
      }
    },
    ensuerUser:(req,res,next)=>{
      if(req.isAuthenticated()){
          res.redirect('/dashboard');
      }
      else{
          return next()
      }
    }
}