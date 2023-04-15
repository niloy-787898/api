const jwt = require('jsonwebtoken');

const genarateeRfreshToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {expiresIn:"3d"})
}

module.exports = {genarateeRfreshToken}