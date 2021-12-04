const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places , descriptors} = require('./seedHelpers')
const DB_URL = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(DB_URL)

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async()=>{
    await Campground.deleteMany({})
    for(let i=0 ; i<50 ; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/190727',
            description:'hello form the another viedo form programming and its so amazing and i love do programming by the way i aloso love editing videos',
            price
        })
       await camp.save()
        console.log(camp);
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})

