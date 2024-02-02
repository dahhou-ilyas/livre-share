const jwt=require('jsonwebtoken');

function AuthenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(token==null) return res.status(401).json({message:"Unauthorized"}); 
    jwt.verify(token,process.env.TOKEN_SECRET,(err,user)=>{
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user=user;

        next();
    })
}

module.exports={AuthenticateToken}