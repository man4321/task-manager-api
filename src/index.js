const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require("../src/router/user");
const taskRouter = require("../src/router/task");
require('./db/mongoose')
const express = require('express');

const app = express();
const port = process.env.PORT;

// this is a middlewares....

// app.use((req,res)=>{
//     res.status(503).send("site is currently down. Check back soon")
// })

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

//How to use multer 


// const multer = require('multer');
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
//            return cb( new Error('please upload doc,docx or pdf file'))
//         }
//         cd(undefined,true);
//     }
// })


app.use('/upload',upload.single('upload'),(req,res)=>{
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})


app.listen(port, () => {
    console.log('server is live on port ' + port);
})




// how to connect to documents.....


// const Task = require('./models/task');
// const User  = require('./models/user');


// const main = async ()=>{
//     const task =  await Task.findById('5f06a1af6789a951c4f62f2a');
//     await task.populate('owner').execPopulate();
//     // console.log(task.owner,"this is owner");
// }
// // main();