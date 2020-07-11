const express = require('express');
const Task = require("../models/task");
const auth = require("../middleware/userAuth");

const router = new express.Router();


router.post('/tasks',auth, async (req, res) => {
    // const task = new Task(req.body);"
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    
    try {
        const tasks =  await task.save();
        res.status(201).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }

})
//GET/tasks?completed=true
//GET/tasks?limit=2&skip=1
//GET/tasks?sortBy=createdAt:desc
router.get('/tasks', auth,async (req, res) => {
    // try {
        // const tasks = await Task.find({owner:req.user._id});
        const match = {}
        const sort={};
        if(req.query.sortBy){
            const part = req.query.sortBy.split(':');
            sort[part[0]]= part[1]==='asc'?1:-1;
        }
        if(req.query.completed){
            match.completed = req.query.completed==="true";
        }
        console.log(req.user)
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }

        }).execPopulate();
        res.send(req.user.tasks);
    // } catch (error) {
    //     res.status(400).send(error);
    // }

    
})

router.get('/tasks/:id',auth,async (req, res) => {
    const _id = req.params.id;
    try {
        const task= await Task.findOne({_id,owner:req.user._id});
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    //validation.....
    const validUpdates = ["description","completed"];
    const updates = Object.keys(req.body);
    const isValid = updates.every((update)=> validUpdates.includes(update));
    if(!isValid) return res.status(400).send()

try {
    const tasks = await Task.findOne({_id:req.params.id,owner:user._id})
    // const tasks = await Task.findById(req.params.id);
    
    // const tasks = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!tasks){
        return res.status(400).send(tasks);
    }
    updates.forEach((update)=> tasks[update]=req.body[update]);
    await tasks.save();
    res.send(req.user.tasks)
} catch (error) {
    res.status(404).send("error in try block");
    
}
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) return res.status(400).send();
        
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
        
    }
})
module.exports = router;
