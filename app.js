//mongodb+srv://Poll:Pass@123@cluster0.mgwod.mongodb.net/poll?retryWrites=true&w=majority

if(process.env.NODE_EVN !=='production'){
    require('dotenv').config();

}
const express  = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const expressHbs = require('express-handlebars');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session); // to store users in session 
const indexRoute = require('./routes/indexRoute');
const authRoute = require('./routes/auth');
const storyRoute = require('./routes/storyRoute');


require('./config/passport')(passport)

const connect = mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connected...'))
.catch(err=> console.log(err));



const public= path.join(__dirname , './public');
const views = path.join(__dirname,'./views');

const app = express();

//bodyParser

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//method override
app.use(methodOverride((req,res)=>{
  if(req.body && typeof req.body==='object' && '_method' in req.body){
      let method = req.body._method;
      delete req.body._method;
      return method;
  }
}));

if(process.env.NODE_EVN !=='production'){
    app.use(morgan('dev'));

}
//handlebars helpers
const { formatDate ,truncate,stripTags ,editIcon,select} = require('./helpers/hbs');


app.engine('.hbs',expressHbs({ helpers:{
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
}
,defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs');

//session middle wear make sure you place it before passport
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(express.static(public));

//set global variable yo use outside the loop in the tempalte


//set the passport middle ware
app.use(passport.initialize());
app.use(passport.session());

// strictly this global variables should be below the passport not above the passport otherwise it will give an error
app.use((req,res,next)=>{
    res.locals.user= req.user || null;
    next();
   });

app.set('views',views);

app.use('/',indexRoute);
app.use('/auth',authRoute);
app.use('/stories',storyRoute);

app.listen(port,()=>{
 console.log(`application is running at http://localhost:${port}`);
});