const jwt = require('jsonwebtoken');

function generateAccessToken(id,username){
    return jwt.sign({id,username},process.env.TOKEN_SECRET,{expiresIn:"1800s"});
}

module.exports={
    generateAccessToken
}