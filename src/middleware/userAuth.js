const Users = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async(req,res,next)=>{
   try {
    const token = req.header('Authorization').replace('Bearer ','');
    const decoded = jwt.verify(token,process.env.JWT_TOKEN_SIGN);
    const user = await Users.findOne({_id:decoded._id,'tokens.token':token})
    // console.log(user)
    if(!user){
        throw new Error("not getting ");
    }
    req.token= token;
    req.user= user;
    next();
   } catch (error) {
       res.status(400).send("please authenticated first")
    //    console.log("something faild")
   }
   
}


module.exports = auth;