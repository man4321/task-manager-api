
const mongoose = require('mongoose');
const User = require('./user');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    },
    owner:{
          type:mongoose.Schema.Types.ObjectId,
          required:true,
          ref:"User"
    }
},{
    timestamps:true
})

// we can't use arrow function here because of binding issue....
taskSchema.pre('save',async function(next){
    console.log('inside task middleware');
    next();
})
const task = mongoose.model('Task',taskSchema )

module.exports=task;