const mongoose=require('mongoose') // mongoose and donenv imported
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL) // connect to MongoDB Atlas 
.then(()=> console.log('db connected'))
.catch((e)=> console.log('error',e))