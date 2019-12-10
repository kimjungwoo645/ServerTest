# ServerTest

# 회원가입
<pre>
router.post("/signup", funtion(req, res, next)
{
    var userObj = req.body;
    var name = userObj.name;
    var id = userObj.id;
    var pw = userObj.pw;

    var db = req.app.get("database");

    var users = db.collection("users");

    users.insertOne({"name" : name, "id" : id, "pw" : pw} function(err, result)
    {
        if(err)
        {
            throw err;
        }
        if(result.ops.length > 0)
        {
            res.json(result.ops[0]);
        }
        else
        {
            res.json({message : "서버 에러"});
        }
    });
});
</pre>

# 로그인
<pre>
router.post('/signin', function(req, res, next)
{
  var userObj = req.body;
  var id = userObj.id;
  var pw = userObj.pw;

  var db = req.app.get("database");

  var users = db.collection("users");

  if(users.findOne("id" : id))
  {
    users.findOne({"id" : id}, function(err, result)
    {
      if(err)
      {
        throw err;
      }
      users.findOne({"_id" : result._id}, function(err, result)
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
</pre>