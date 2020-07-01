const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const Task = require('../src/models/task')
const { setupDatabase, userOneId, userOne, taskOne,userTwo,taskTwo } = require('./db')



beforeEach(setupDatabase)

test('Should create a new task', async () => {
    const response = await request(app).post('/task')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send(taskOne)
        .expect(201)

    const task = await Task.findById(response.body._id)

    expect(task).not.toBeNull()
})

test('Get all tasks for userOne',async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(1)
})

test('Should not delete task of another user', async () => {
    await request(app).delete(`/tasks/${taskTwo._id}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)

    const task = Task.findById(taskTwo._id)
    expect(task).not.toBeNull()




})