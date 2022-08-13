require('dotenv').config()
const express=require("express")
const morgan =require("morgan")
const cors=require('cors')
const jwt=require('jsonwebtoken')
const app=express();
app.use(morgan());
app.use(cors());

app.use(express.json());

const posts=[
    {
        username:"adarsh",
        title:"post 1"
    },
    {
        username:"raunak",
        title:"post 2"
    }
]

app.get('/',authenticateToken,(req,res)=>{//passing authenticateToken as middleware here 
    console.log("server is running");
    res.json(posts.filter(post=> post.username===req.user.name))
})
app.post('/login',(req,res)=>{
//authenticated user 

const username=req.body.username;
const user={name:username}

const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
res.json({accessToken:accessToken})
})

function authenticateToken(req,res,next){//this function work as middleware
const token=req.headers['authorization']
console.log(token);

jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err)return res.sendStatus(403)
    req.user=user;
    next()
})
}


const Port=process.env.PORT || 6000;

app.listen(Port,()=>{
    console.log(`Port is listen on ${Port}`);
})