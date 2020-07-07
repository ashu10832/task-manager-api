const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelEmail} = require('../emails/account')



const router = new express.Router()

// Create a new user
router.post('/users',async (req,res)=>{
    console.log('New Signup Request')
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email,user.name)
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
        //console.log(req.user)
        const user = await req.user.remove()
        sendCancelEmail(user.email,user.name)
        res.send(req.user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


// Login
router.post('/users/login',async (req,res)=>{
    console.log('New Login Request:' + Date.now())
    console.log(req.body)
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


const upload = multer({
    limits:{
        fileSize:2000000
    },
    fileFilter: (req,file,cb) => {
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('File type unacceptable'))
        }
        cb(undefined,true)
        
    }
})


// Upload profile picture
// POST /users/me/avatar
router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res)=>{

    const buffer = await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


// delete profile picture
// DELETE /users/me/avatar
router.delete('/users/me/avatar', auth, async (req,res)=>{
    delete req.user.avatar
    await req.user.save()
    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


// get the profile picture
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})


module.exports = router
