const express=require('express')  //importing all depenedncies
const app = express()   // setting express
const cors=require('cors')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const server=require('http').createServer(app) // creating server
app.use(express.json()) // express cofiguration
app.use(express.urlencoded({ extended: false }))
app.use(cors())
require('./database/connection') // importing DB connection

app.get('/',(req,res)=>{  // base route
    res.send('Backend')
})

const Users=require("./database/models/user") // importiing user Schema



const adult=(dob,dor)=>{    // function to evatuate is a user is an adult based on birth and registration dates
    const dobDays=dob.getFullYear()*365+dob.getMonth()*30+dob.getDate()
    const dorDays=dor.getFullYear()*365+dor.getMonth()*30+dor.getDate()
    if((dorDays-dobDays)/365 >= 20) return true
    return false
}

app.post('/signup',async (req,res)=>{  // Sign Up route
    try {
        const { name, email, pass, phone, salary , dob } = req.body // extracting credentials from request body
        const exists = await Users.findOne({ email }) //fetch user from database (if it exists)
        if (exists) {
            res.json({status:'user already exists'})
        }else {
            const birth=new Date(dob)
            const reg=new Date()
            
            if(adult(birth,reg) && salary>=25000){  // checking eligibility
                // console.log('success')
                const newUser = new Users({ name , email , pass , phone , salary ,ppa:salary*12, dob:birth,dor:reg})
                // creating a User with given values
                jwt.sign({newUser},process.env.SECRET_KEY, { expiresIn: '1d' },(e, token) => { // creating JWT for authentication
                    if(e) { console.log(e) }  
                    // console.log("token->",token)
                    newUser.token=token
                    res.json({status:'account created successfully',token:token}) // response
                })
                newUser.save() // saving the user in the DB
            }else{
                res.json({status:'not eligible for registration'}) // not eligible
            }
        }
    }
    catch (error) {
        console.log(error)
        res.json({status:'server error'})
    }
})


app.post('/login',async (req,res)=>{ // Log In route
    try{
        const{email,pass}=req.body
        const user=await Users.findOne({email:email})
    
        if(user){
            if(user.pass===pass){ // checking if password is correct
                // res.json('authorize')
                jwt.sign({user},process.env.SECRET_KEY, { expiresIn: '1d' },(err, token) => { //JWT for authentication
                    if(err) { console.log(err) }  
                    // console.log(token)
                    user.token=token  // updating token
                    user.save()  // saving user with updated token
                    res.json({status:'logged in successfully',token:token})   //response
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


app.get('/user',async (req,res)=>{  // User Data route
    try{
        const jwtToken = req.headers['authorization'].split(" ")[1] // extracting JWT from Bearer token in request header 
        // console.log(jwtToken)
        jwt.verify(jwtToken, process.env.SECRET_KEY ,async (err, authorizedData) => { // verifying the token
            if(err){
                res.json({status:'authorization failed'})
            } else {
                const user=await Users.findOne({token:jwtToken})  // finding user based on token
                if(user){
                    res.json({ppa:user.ppa,phone:user.phone,email:user.email,salary:user.salary,dor:user.dor,dob:user.dob}) //response
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


app.post('/borrow',async (req,res)=>{ // Borrow Money route
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
                    user.ppa-=borrow // updating PPA (since no specific formula is given for calculating PPA)
                    const monthlyPayment=borrow*(1.08)/(years*12)
                    user.save()
                    res.json({ppa:user.ppa,month:monthlyPayment})  // response
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



const port = process.env.PORT || 4000   // server started
server.listen(port, () => {
    console.log(`http://localhost:${port}`)
})