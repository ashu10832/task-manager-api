const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
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

module.exports = User