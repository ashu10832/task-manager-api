const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')


const router = new express.Router()

// Create a new task
router.post('/task', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,owner:req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    } 
})

// GET /tasks?completed=true
// GET /tasks?limit=2&skip=0
// GET /tasks?sortBy=completed&order=asc
// GET /tasks?sortBy=createdAt_desc
// Get all the tasks

router.get('/tasks',auth , async (req,res)=>{
    const match = {}
    if(req.query.completed){
        if(req.query.completed === 'true'){
            match.completed = true
        } else if (req.query.completed === 'false'){
            match.completed = false
        } else {
            res.status(400).send()
        }
    }

    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'asc'? 1 : -1
    }

    try {
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                sort,
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Get a single task by id
router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner:req.user._id
        })
        if(task == undefined){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


// Update a task by id
router.patch('/tasks/:id', auth , async (req,res)=>{
    console.log('New edit request: ' , req.body)
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({
            error:'Invalid Updates'
        })
    }

    try {
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update)=> {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete a task by id
router.delete('/tasks/:id',auth ,async (req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router
