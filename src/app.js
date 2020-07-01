const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



module.exports = app




