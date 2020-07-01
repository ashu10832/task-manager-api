const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id:userOneId,
    name:'Ashu',
    email:'ashu10832@gmail.com',
    password:'testuserpass',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id:userTwoId,
    name:'Ashu',
    email:'vishu@gmail.com',
    password:'testuserpass',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id:new mongoose.Types.ObjectId(),
    description:'description',
    owner:userOneId
}

const taskTwo = {
    _id:new mongoose.Types.ObjectId(),
    description:'description',
    owner:userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()

}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    setupDatabase,
    taskOne,
    taskTwo
}