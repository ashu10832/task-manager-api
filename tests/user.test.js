const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user');
const { setupDatabase ,userOne,userOneId} = require('./db');



beforeEach(setupDatabase);


test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
    .send({
            name: 'test',
            email:'test@test.com',
            password:'festivals'
        })
    .expect(201)

    //Assertion that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name:'test',
            email:'test@test.com',
        },
        token:user.tokens[0].token
    })

    expect(user.password).not.toBe('festivals')
})

test('Should login existing user',async () => {
    const response = await request(app).post('/users/login')
        .send({
            email:'ashu10832@gmail.com',
            password:'testuserpass'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()


    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login non existant user',async () => {
    await request(app).post('/users/login')
        .send({
            email:'notpresent@gmail.com',
            password:'testuserpass'
        })
        .expect(400)
})

test('Should get profile for user',async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user',async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', '')
        .send()
        .expect(401)
})

test('Should delete user profile', async () => {
    await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete user profile for unauthenticated user', async () => {
    await request(app).delete('/users/me')
    .set('Authorization', '')
    .send()
    .expect(401)
})

test('Should upload avatar image',async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/pix.png')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user fields',async () => {

    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({name:'Vishu'})
    .expect(200)

    const user = await User.findById(userOneId)

    
    expect(user).toMatchObject({
        name:'Vishu',
        ...user
    })
})
test('Should not update invalid user fields',async () => {

    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({location:'Delhi'})
    .expect(404)

})


