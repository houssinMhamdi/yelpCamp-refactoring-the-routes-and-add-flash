const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schemas.js')


const validateCampground = (req,res,next)=>{
    const result = campgroundSchema.validate(req.body)
    console.log(result);
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}







router.get('/',async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})

})

router.get('/new',(req,res,next)=>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground,catchAsync(async(req,res,next)=>{
    
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id',catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campgrounds = await Campground.findById(id).populate('reviews')
    if(!campgrounds){
        req.flash('error','Campground does not exists')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show',{campgrounds})
}))

router.get('/:id/edit',catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id',validateCampground,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully Updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully Deleted Campground')
    res.redirect(`/campgrounds`)
}))


module.exports = router