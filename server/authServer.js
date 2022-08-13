require('dotenv').config()
const express=require("express")
const morgan =require("morgan")
const cors=require('cors')
const jwt=require('jsonwebtoken')
const app=express();
app.use(morgan());
app.use(cors());

app.use(express.json());

let refreshTokens=[]//storing refresh tokens

app.post("/token",(req,res)=>{
    const refreshToken=req.body.token
    if(refreshTokens==null)return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken))return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOEKN_SECRET,(err,user)=>{
if(err) return res.sendStatus(403)
const accessToken=generateAccessToken({name:user.name})
res.json({accessToken:accessToken})
    })
})

app.delete('/logout',(req,res)=>{
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res)=>{
//authenticated user 

const username=req.body.username;
const user={name:username}

const accessToken=generateAccessToken(user)
const refreshToken=jwt.sign(user,process.env.REFRESH_TOEKN_SECRET)
refreshTokens.push(refreshToken)
res.json({accessToken:accessToken,refreshToken:refreshToken})
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1min'})
}


const Port=process.env.PORT || 7000;

app.listen(Port,()=>{
    console.log(`Port is listen on ${Port}`);
})