var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//TODO : 회원가입
router.post('/signup', function(req, res, next)
{
  var userObj = req.body;
  var username = userObj.username;
  var id = userObj.id;
  var pw = userObj.pw;

  var db = req.app.get("database");

  if(db == undefined)
  {
    res.json({message : '503 Server Error'});
    return;
  }

  var userValidation = function(username, id, pw)
  {
    if (username =="" || pw == "" || id == "")
    {
      res.json({message : "400 Bad Request"});
      return false;
    }
    if (username.length < 4 || username.length > 20)
    {
      if(username.length <4)
      {
        res.json({message : "username is too Short"});
      }
      else if(username.length > 20)
      {
        res.json({message : "username is too long"});
      }
      return false;
    }
    if (id.length < 6 || id.length > 12)
    {
      if(id.length < 6)
      {
        res.json({message : "id is too Short"});
      }
      else if(id.length > 12)
      {
        res.json({message : "id is too long"});
      }
      return false;
    }
    if (pw.length < 8 || pw.length > 20)
    {
      if(pw.length < 8)
      {
        res.json({message : "Password is too Short"});
      }
      else if(pw.length > 20)
      {
        res.json({message : "Password is too long"});
      }
      return false;
    }
    return true;
  }

  var validate = userValidation(username, id, pw);

  if(validate == false)
  {
    res.json({message : "400 Bad Request"});
  }

  var users = db.collection("users");



  users.count({ $or: [{"username" : username}, {"id" : id}]} , function(err , result)
  {
    if(err)
    {
      throw err;
    }
    if(result > 0)
    {
      res.json({message : "400 Bad Request"});
    }
    else
    {
      var salt = Math.round((new Date().valueOf() * Math.random())) + "";
      var cryptopw = crypto.createHash("sha512").update(pw,salt).digest("base64");

      users.insertOne({"username" : username, "id" : id, "pw" : cryptopw, "salt" : salt}, function(err, result)
      {
        if(err)
        {
          throw err;
        }
        if (result.ops.length > 0)
        {
          res.json(result.ops[0]);
        }
        else
        {
          res.json({message : '503 Server Error'})
        }
      });
    }
  });
  
});

//TODO : 로그인
router.post('/signin', function(req, res, next)
{
  var userObj = req.body;
  var id = userObj.id;
  var pw = userObj.pw;

  var db = req.app.get("database");

  if(db == undefined)
  {
    res.json({message : '503 Server Error'});
    return;
  } 

  var users = db.collection("users");

  if(users.findOne({"id" : id}))
  {
    users.findOne({"id" : id}, function(err, result)
    {
      if(err)
      {
        throw err;
      }
      users.findOne({"_id" : result._id}, function(err, result)
      {
        var salt = Math.round((new Date().valueOf() * Math.random())) + "";
        var cryptopw = crypto.createHash("sha512").update(pw,salt).digest("base64");

        if(err)
        {
          throw err;
        }
        if(result.pw == cryptopw)
        {
          res.json({message : "Login Succecs"});
        }
        else
        {
          res.json({message : "Invalid pw"})
        }
      });
    });
  }
  else
  {
    res.json({message : "Invalid id"})
  }
});

module.exports = router;

