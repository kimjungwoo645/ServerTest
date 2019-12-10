# ServerTest

## 회원가입

### 요청
> [POST] /users/signup

전달값
<pre>
{
  "username" : "potato",
  "id" : "potato12",
  "pw" : "potatogood12"
}
</pre>
### 결과
#### 성공
<pre>
{
  "username" : "potato",
  "id" : "potato12",
  "pw" : "potatogood12"
}
</pre>
#### 실패
<pre>
{
  "message" : "400 Bad Request"
}
</pre>
## 로그인

### 요청
> [POST] /users/signin

전달값
<pre>
{
  "id" : "potato12",
  "pw" : "potatogood12"
}
</pre>
### 결과

#### 성공
<pre>
{
    "message" : "Login Success"
}
</pre>
#### 실패
<pre>
{
  "message" : "Login Fail"
}
</pre>
