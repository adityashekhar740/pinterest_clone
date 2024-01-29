
var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
// const postModel = require("./Posts");
const localStrategy=require('passport-local').Strategy
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get('/login',function(req,res){
  res.render('login',{error:req.flash('error')});
})

router.get('/profile',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('profile',{user});
})
router.get('/feed',function(req,res){
  res.render('feed');
})

router.post('/register',function(req,res){
  const userData=new userModel({
    username:req.body.username,
  email:req.body.email,
  fullname:req.body.fullname,
  })
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}));


router.get('/logout',function(req,res){
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect('/login');
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
