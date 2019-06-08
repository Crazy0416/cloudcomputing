var express = require('express');
var router = express.Router();
const crypto = require("crypto");
const models = require("../models");

/*
router.get('/', function(req, res, next) {
  if(req.cookie) {
    console.log(req.cookies);
  }
  res.send('환영합니다~');
});
*/

router.get('/login', function(req, res, next) {
  let session = req.session;

  res.render("user/login", {
    id : session.user_id
  });
});


router.get('/logout', function(req,res,next) {
  req.session.destroy();
  res.clearCookie('user');
  res.redirect('/login')
})



router.get('/', function(req, res, next) {
  res.render("user/signup");
});


router.post("/", function(req,res,next){
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest('hex');
    console.log(body.userEmail)
    models.user.create({
        user_id: body.userEmail,
        password: hashPassword,
        name: body.userName,
        salt: salt,
    })
    .then( result => {
        res.redirect("/login");
    })
    .catch( err => {
        console.log(err)
    })
})


router.post("/login", function(req,res,next){
  let body = req.body;
  models.user.findAll({
      where: {user_id : body.userEmail}
  })
  .then( result => {
      let dbPassword = result[0].password;
      console.log(dbPassword)
      let inputPassword = body.password;
      let salt = result[0].salt;
      let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

      if(dbPassword === hashPassword){
          console.log("비밀번호 일치");
          res.cookie("user", body.userEmail, {
            expires : new Date(Date.now() + 900000),
            httpOnly: true
          })
          req.session.user_id = body.userEmail
          console.log(req.session.id)
          res.redirect("/h");
      }
      else{
          console.log("비밀번호 불일치");
          res.redirect("/login");
      }
  })
  .catch( err => {
      console.log(err);
  });
});
module.exports = router;
