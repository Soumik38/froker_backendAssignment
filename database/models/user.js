const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },email:{
        type:String,
        required:true,
        unique:true
    },pass:{
        type:String,
        required:true,
    },phone:{
        type:Number,
        required:true
    },salary:{
        type:Number,
        required:true
    },dob:{      // date of birth 
        type:Date,
        required:true
    },dor:{      // date of registration
        type:Date,
        required:true
    },ppa:{      // Purchase Power Amount
        type:Number
    },token:{    // JWT token
        type:String
    }
})
const Users=mongoose.model('User',userSchema)
module.exports=Users