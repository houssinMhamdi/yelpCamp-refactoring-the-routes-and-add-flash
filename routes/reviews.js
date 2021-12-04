const express = require('express')
const router = express.Router({mergeParams:true})

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground')
const Review = require('../models/review')

const {reviewSchema} = require('../schemas.js')



const validatereview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}




router.post('/',validatereview,catchAsync(async (req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully Create new Review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
  const {id , reviewId} = req.params
  await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash('success','Successfully Deleted a Review!')
  res.redirect(`/campgrounds/${id}`)
}))


module.exports = router