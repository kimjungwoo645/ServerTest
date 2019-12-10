# ServerTest

회원가입
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