const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },
    age:{
        type: Number,
        required:true,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age cannot be negative')
            }
        }
    },
    email:{
        required:true,
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
            
        }
    },
    password:{
        required:true,
        type:String,
        trim:true,
        validate(value){
            if(value.length < 6){
                throw new Error('Password length too short. Should be greater than 6 char')
            }
            if(validator.equals(value,'password')){
                throw new Error('Password cannot be set to "password"')
            }
        }
    }
})

// Hash the plain text password before save
userSchema.pre('save',async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }    

    next()

})

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to find user')
    }

    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error('Incorrect Password')
    }
    return user

}

const User = mongoose.model('User',userSchema)

module.exports = User