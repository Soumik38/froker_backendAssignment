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

const adult=(dob,dor)=>{
    const dobDays=dob.getFullYear()*365+dob.getMonth()*30+dob.getDate()
    const dorDays=dor.getFullYear()*365+dor.getMonth()*30+dor.getDate()
    if((dorDays-dobDays)/365 >= 20) return true
    return false
}

app.post('/signup',async (req,res)=>{
    try {
        const { name, email, pass, phone, salary , dob } = req.body
        const exists = await Users.findOne({ email })
        if (exists) {
            res.json({status:'user already exists'})
        }else {
            const birth=new Date(dob)
            const reg=new Date()
            
            if(adult(birth,reg) && salary>=25000){
                // console.log('success')
                const newUser = new Users({ name , email , pass , phone , salary ,ppa:salary*12, dob:birth,dor:reg})
                jwt.sign({newUser},process.env.SECRET_KEY, { expiresIn: '1d' },(err, token) => {
                    if(err) { console.log(err) }  
                    // console.log("token->",token)
                    newUser.token=token
                    res.json({status:'account created successfully',token:token})
                })
                newUser.save()
            }else{
                res.json({status:'not eligible for registration'})
            }
        }
    }
    catch (error) {
        console.log(error)
        res.json({status:'server error'})
    }
})


app.post('/login',async (req,res)=>{
    try{
        const{email,pass}=req.body
        const user=await Users.findOne({email:email})
    
        if(user){
            if(user.pass===pass){
                // res.json('authorize')
                jwt.sign({user},process.env.SECRET_KEY, { expiresIn: '1d' },(err, token) => {
                    if(err) { console.log(err) }  
                    // console.log(token)
                    user.token=token
                    user.save()
                    res.json({status:'logged in successfully',token:token})
                })
            }else{
                res.json({status:'wrong password'})
            }
        }else{
            res.json({status:'user does not exist'})
        }
    }catch(e){
        console.log(e)
        res.json({status:'server error'})
    }
  })

app.get('/user',async (req,res)=>{
    try{
        const jwtToken = req.headers['authorization'].split(" ")[1];
        // console.log(jwtToken)
        jwt.verify(jwtToken, process.env.SECRET_KEY ,async (err, authorizedData) => {
            if(err){
                res.json({status:'authorization failed'})
            } else {
                const user=await Users.findOne({token:jwtToken})
                if(user){
                    res.json({ppa:user.ppa,phone:user.phone,email:user.email,salary:user.salary,dor:user.dor,dob:user.dob})
                }else{
                    res.json({status:'authorization failed'})
                }
            }
        })
    } catch (e) {
        console.log(e)
        res.json({status:'server error'})
    }
})

app.post('/borrow',async (req,res)=>{
    try{
        const {borrow,years}=req.body
        const jwtToken = req.headers['authorization'].split(" ")[1];
        // console.log(jwtToken)
        jwt.verify(jwtToken, process.env.SECRET_KEY ,async (err, authorizedData) => {
            if(err){
                res.json({status:'authorization failed'})
            } else {
                const user=await Users.findOne({token:jwtToken})
                if(user){
                    user.ppa-=borrow
                    const monthlyPayment=borrow*(1.08)/(years*12)
                    user.save()
                    res.json({ppa:user.ppa,month:monthlyPayment})
                }else{
                    res.json({status:'authorization failed'})
                }    
            }
        })
    } catch (e) {
        console.log(e)
        res.json({status:'server error'})
    }
})

const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`http://localhost:${port}`)
})