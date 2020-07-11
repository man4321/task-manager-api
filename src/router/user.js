const express = require('express');
const User = require('../models/user')
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/userAuth");
const multer = require('multer');
const {sendWelcomeEmail,SendGoodByeEmail}= require('../emails/account');
const router = new express.Router();




router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        const users = await user.save();
        sendWelcomeEmail(users.email,users.name);
        const token = await users.genrateAuthToken();
        res.status(201).send({users,token})
    } catch (error) {
        res.status(400).send(error)
    }



})

router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(User,req.body.email,req.body.password);

        const token = await user.genrateAuthToken();
        
        // console.log(user);
        res.send({user,token});
        
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return req.token!==token.token;
        })
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send('something wrong..')
    }
})

router.post('/users/logoutAll',auth, async (req,res)=>{
    try {
        req.user.tokens = req.tokens.concat({});
        await req.user.save();
        res.status(200).send("all logout");
    } catch (error) {
        res.status(500).send("logouted all")
        
    }
})

router.get('/users/me',auth,async (req, res) => {
    try {
        res.send(req.user)
        
    } catch (error) {
        res.send("authentication faild...")
        
    }
    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (error) {
    //     res.status(500).send(error)

    // }

})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const users =   await User.findById(_id);
//         res.send(users);
//     } catch (error) {
//         res.status(500).send(error)

//     }
// })



router.patch('/users/me',auth,async(req,res)=>{
    //validation.....
    const validUpdates = ["name","age","password","email"];
    const updates = Object.keys(req.body);
    const isValid = updates.every((update)=> validUpdates.includes(update));
    if(!isValid) return res.status(404).send()

try{
    // const user= await User.findById(req.user._id);

    updates.forEach((update)=> req.user[update]=req.body[update]);
    await req.user.save();
    // const users = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    // const users = await 
    
    // if(!user){
    //     return res.status(400).send(user);
    // }
    res.send(req.user)
}
 catch (error) {
    res.status(404).send(error);
    
}
})
router.delete('/users/me',auth,async(req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if(!user) return res.status(400).send();
        
        await req.user.remove();
        res.status(201).send(req.user);
        SendGoodByeEmail(req.user.email,req.user.name)
    } catch (error) {
        res.status(500).send(error);
        
    }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('please upload a image file'))
        }
        cb(undefined,true);
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
   req.user.avatar=undefined;
   await req.user.save();
    res.status(201).send('photo deleted');
})

router.get('/users/:id/avatar',async(req,res)=>{
 try {
     const user = await User.findById(req.params.id);
 
     if(!user || !user.avatar){
          console.log("error occoured");
     }
     res.set('Content-Type','image/png');
     res.send(user.avatar);
     
 } catch (error) {
     res.send(error);
     
 }
})

module.exports = router;
