const mongoose = require('mongoose');

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl,
    {
        useNewUrlParser: true,
        useCreateIndex: true
    });






// const FirstUser = new user({
//     name:'Manohar',
//     password:'this1234 ',
//     age:22,
// })

// FirstUser.save().then(()=>{
//    console.log(FirstUser);
// }).catch((error)=>{
//   console.log("something went wrong...............",error);
// })


// task with mongoose



// const firstTask = new task({
//     description: "      This is my first task      ",
//     // completed:true
// })

// firstTask.save().then(() => {
//     console.log(firstTask)
// })