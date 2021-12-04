const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')



const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

const DB_URL = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(DB_URL)




app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views','views')


app.use(express.urlencoded({extends:true}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'thisisshoudebebettersecret',
    resave:false,
    saveUninitialized: true, 
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }   
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res,next)=>{
    res.render('home')
})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500} = err
    if(!err.message) err.message = 'oh no there is an error'  
    res.status(statusCode).render('error',{err})
})

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`servert run port ${PORT}`);
})