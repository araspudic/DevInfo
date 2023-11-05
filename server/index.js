if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

var  Db = require('./controllers/User.contr');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')

app.set('view-engine','ejs')
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash())
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(methodOverride('_method'))

//Require routes
const Network=require('./routes/Network.routes')
app.use('/api', Network)

const Device=require('./routes/Device.routes')
app.use('/api', Device)

const IDF=require('./routes/IDF.routes')
app.use('/api',IDF)

const Licenca=require('./routes/Licenca.routes')
app.use('/api',Licenca)

const User=require('./routes/User.routes');
app.use('/api',User)

const History=require('./routes/History.routes');
app.use('/api',History)

//--------------------------------------------------------------


function setupPassportWithUsers() {
  Db.getUser()
    .then(users => {
      const useri = users[0];
  
      initializePassport(
        passport,
        name => useri.find(user => user.Name === name),
        id => useri.find(user => user.userID === id)
      );
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


// POST /login
app.post("/login", (req,res,next)=>{
  passport.authenticate("local",
  (err,user,info) => {
    if (err) throw err;
    if(!user) res.send("Username or password is incorrect!");
    else {
      req.login(user, (err)=>{ 
        if (err) throw err;
        res.send("Successfully auth")
    });
    }
  })(req,res,next);
})

// User logout 
app.delete('/logout', (req, res) => {
  setupPassportWithUsers()
  console.log('Logout route accessed');
  req.logOut(function(err) {
    if (err) {
      console.error('Logout failed:', err);
    }
    else {
      res.send('Logged out');
  }
  });
});


// Check if user is logged in
function checkAuth (req,res,next){
  if (req.isAuthenticated()){
    console.log("next")
    return next()
  }
  console.log("chekAuth no")
  res.redirect('/login')
}

// Route to check if the user is logged in
app.get('/api/check-login', (req, res) => {
  if (req.isAuthenticated()) {
    const userRole = req.user.ulogaFK;
    const userName = req.user.Name;
    const userID = req.user.userID;
    res.json({ loggedIn: true, userID: userID, userName: userName, userRole: userRole });  
  } else {
    res.json({ loggedIn: false, userRole: 0});
  }
});


// 
setupPassportWithUsers();

//deafult route
app.get("/",(req, res) => { 
    res.json({ message: "Welcome to Andro's application." });
  });

app.listen(3001, ()=> {
    console.log("Running on port 3001...")
});


