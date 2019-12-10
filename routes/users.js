var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

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
    //회원가입정보 확인
    if (username =="" || pw == "" || id == "")
    {
      res.json({message : "400 Bad Request"});
      return false;
    }
    if (username.length < 4 || username.length > 12)
    {
      if(username.length <4)
      {
        res.json({message : "username is too Short"});
      }
      else if(username.length > 12)
      {
        res.json({message : "username is too long"});
      }
      return false;
    }
    if (id.length < 4 || id.length > 12)
    {
      if(id.length <4)
      {
        res.json({message : "id is too Short"});
      }
      else if(id.length > 12)
      {
        res.json({message : "id is too long"});
      }
      return false;
    }
    if (pw.length < 4 || pw.length > 12)
    {
      if(pw.length <4)
      {
        res.json({message : "Password is too Short"});
      }
      else if(pw.length > 12)
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

  var usersCollection = db.collection("users");

  //username, id 가 기존에 존재하는지 확인
  usersCollection.count({ $or: [{"username" : username}, {"id" : id}]} , function(err , result)
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
      usersCollection.insertOne({"username" : username, "id" : id, "pw" : pw}, function(err, result)
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

  var usersCollection = db.collection("users");

  if(usersCollection.id == id)
  {
    usersCollection.find({"id" : id}, function(err, result)
    {
      if(err)
      {
        throw err;
      }
      usersCollection.find({"_id" : result._id}, function(err, result)
      {
        if(result.pw == pw)
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

