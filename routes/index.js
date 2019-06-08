const express = require('express');
const models = require("../models");
var formidable = require('formidable');
const router = express.Router();
var AWS = require("aws-sdk");
var crypto = require("crypto");
var sequelize = require("sequelize");
var Op = sequelize.Op

AWS.config.loadFromPath('./config/aws_config.json')

/*로그인 후 메인화면*/
router.get('/h', function(req,res,next) {
  if(!req.session.user_id) {
    res.redirect("login");
  }
    res.render("index", {
      title: 'DropBox',
      session: req.session
  })
  req.session.directory = req.session.user_id
})


/* 폴더 추가 */
router.post('/home',function(req,res,next) {
  function findpath (root_dir,iterator,path) {
    return new Promise(function(resolve, reject) {
      temp(root_dir,iterator,path);
      function temp(root_dir,iterator,path) {
        if(iterator == root_dir ) {
          console.log(path)
          path.path = root_dir +'+' + path.path;
          resolve(path);
          return;
        }
        models.folder.findAll({
          where:{
            foldername:iterator,
            root_user:req.session.user_id
          }
        }).then(result => {
          path.path = result[0].foldername + '+' +path.path;
          iterator = result[0].parent_dir;
          temp(root_dir,iterator,path);
        })
      }
      
    })
  }
  if(!req.session.user_id) {
    res.redirect("login");
  }
  
  let temp = (req.session.directory).split("+");
  console.log(temp)
  var parent_dir = temp[temp.length-1]
  var path = {path:req.body.Foldername};
  if(req.session.user_id == parent_dir) {
    path.path = req.session.user_id + "+" + req.body.Foldername;
    models.folder.create({
      foldername:req.body.Foldername,
      parent_dir:parent_dir,
      directory:path.path,
      root_user:req.session.user_id
  })
  }
  else {
    iterator = parent_dir;
    findpath(req.session.user_id,iterator,path)
    .then(Path =>{
      models.folder.create({
        foldername:req.body.Foldername,
        parent_dir:parent_dir,
        directory:Path.path,
        root_user:req.session.user_id
      })
    })
  }
  res.redirect('/home/'+req.session.directory)
})



/* 폴더 access && 검색 결과*/
router.get('/home/:directory',function(req,res,next) {
  if(!req.session.user_id) {
    res.redirect("/login");
  }
  if(typeof req.query.search_result !== 'undefined') {
    models.file.findAll({
      where: {
        file_name : {
          [Op.like]: "%"+req.query.search_result+"%"
        },
        root_user : req.session.user_id
      }
    }).then(result => {
      res.render("show", {
        title: 'DropBox',
        posts:result,
        folders:[],
        session: req.session,
        parent_dir: parent_dir,
        parent_path: parent_path,
        tags: []
      })
    })
  }
  else {
  
  models.folder.findAll({
    where: {
      directory:req.params.directory
    }
  }).then(result => {
    console.log(result)
    if(result.length == 0 && req.session.user_id != req.params.directory) {
      res.redirect('/h')
    }
  })
  req.session.search = req.body.sumit;
  
  var auto_tag =[]
  models.file.findAll({
    where: {
      root_user : req.session.user_id
    }
  }).then(result => {
    for(var i=0; i<result.length; i++) {
      auto_tag.push(result[i].file_name)
      console.log(auto_tag)
    }
  })
  let temp = (req.params.directory).split("+");
  var parent_dir = temp[temp.length-1]
  var parent_path = '';
  for(var i=temp.length-2; i>=0;i--) {
    parent_path = temp[i] + "+" + parent_path
  }
  parent_path = parent_path.substr(0,parent_path.length-1)
  console.log("parent_path: " + parent_path);
  req.session.directory = req.params.directory;
  console.log("dir is: ",parent_dir)
  models.folder.findAll({
    where: {
      parent_dir : parent_dir,
      root_user : req.session.user_id
    }
  }).then(folder => {
    models.file.findAll({
      where: {
        root_user: req.session.user_id,
        parent_dir: parent_dir
      }
    }).then(result => {
      req.session.directory = req.params.directory;
      res.render("show", {
        title: 'DropBox',
        posts:result,
        folders:folder,
        session: req.session,
        parent_dir: parent_dir,
        parent_path: parent_path,
        tags:auto_tag,
        length:auto_tag.length
      })
    })
  })
}
})


// 업로드
router.post('/upload_receiver',function(req,res) {
  
  var form = new formidable.IncomingForm();
  console.log("AA");
   form.parse(req, function(err, fieldn, files){
       var s3 = new AWS.S3();
       console.log(files.userfile.name)
       var hashinfo = crypto.createHash("sha512").update(files.userfile.name + files.userfile.size).digest('hex');
       var params = {
            Bucket:'drop-box-test',
            Key:hashinfo,
            ACL:"public-read-write",
            Body: require('fs').createReadStream(files.userfile.path)
       }
       console.log("AA");
       s3.upload(params, function(err, data){
            //var result='';
            console.log("AA");
            var url = "https://s3.amazonaws.com/drop-box-test/"+hashinfo
            
            let temp = (req.session.directory).split("+");
            var parent_dir = temp[temp.length-1]
            if(err)
                result = 'Fail';
            else {
                //result = `<img src="${data.Location}">`;
                
                console.log("upload: ",req.session.directory)
                models.file.create({
                  hash: hashinfo,
                  file_name : files.userfile.name,
                  file_url: url,
                  filetype: files.userfile.type,
                  filevolume: files.userfile.size,
                  root_user: req.session.user_id,
                  parent_dir: parent_dir,
                  directory: req.session.directory
                })
            }
            //res.send(`<html><body>${result}</body></html>`)
            res.redirect('/home/'+req.session.directory)
              
       });
   });
})

module.exports = router;
