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
    },dob:{
        type:Date,
        required:true
    },dor:{
        type:Date,
        required:true
    },status:{
        type:String
    },ppa:{
        type:Number
    },token:{
        type:String
    }
})
const Users=mongoose.model('User',userSchema)
module.exports=Users