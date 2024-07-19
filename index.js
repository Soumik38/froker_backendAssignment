const express=require('express')
const app = express()
const cors=require('cors')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const server=require('http').createServer(app)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
require('./database/connection')

app.get('/',(req,res)=>{
    res.send('Backend')
})

const Users=require("./database/models/user")

app.post('/signup',async (req,res)=>{
    try {
        const { name, email, pass, phone, salary , dob } = req.body

        const alreadyExists = await Users.findOne({ email })
        if (alreadyExists) {
            res.json({auth:'exists'})
        }
        else {
            const newUser = new Users({ name, email ,pass,attempts:0})
            jwt.sign({newUser},process.env.SECRET_KEY, { expiresIn: '2d' },(err, token) => {
                if(err) { console.log(err) }  
                // console.log(token)
                res.json({auth:'notexists',token:token})
            })
            newUser.save()

        }
    }
    catch (error) {
        console.log(error)
        res.json('notexists')
    }
})


const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`http://localhost:${port}`)
})