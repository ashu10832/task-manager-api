const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')


const router = new express.Router()

// Create a new user
router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    } 
})

// Get my user info
router.get('/users/me', auth, async (req,res)=>{
    res.send(req.user)
})



// Update my user info
router.patch('/users/me', auth , async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({
            error:'Invalid Updates'
        })
    }

    try {
        const user = req.user
        updates.forEach((update)=> {
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
        
    }
})

// Delete my user profile
router.delete('/users/me', auth ,async (req,res)=>{
    try {
        console.log(req.user)
        const user = await req.user.remove()
        res.send(req.user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


// Login
router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})

    } catch (error) {
        res.status(400).send(error)
        
    }
})


// Logout of current session
router.post('/users/logout',auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> token.token != req.token )
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
        
    }
})


// Logout of all sessions
router.post('/users/logoutAll',auth, async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
        
    }
})


module.exports = router
