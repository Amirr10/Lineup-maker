const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')

const Player = require('./model/playersSchema')
require('dotenv').config()

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true })
        .then(() => console.log("Mongoose"));



app.get('/', (req, res) => {
    
    let p = Player.find( (err, doc) => {
        console.log(doc)
        res.json(doc)
    })
})


app.post('/post', (req, res) => {
    console.log(req.body, "From post")
    let newPlayer = new Player(req.body)

    newPlayer.save( (err) => {
        if(err){
          console.log("Error")
        }
    })
    res.json();
})


//delete a player from db
app.post('/delete', (req, res) => {
    console.log(req.body.name, "From post")

    Player.deleteOne({name:req.body.name}, (err, doc) => {
        if(err){
            console.log(err)
        } else {
            console.log(doc)
        }
       
    })
    res.json();
})


app.listen('5000', () => console.log("Connected"));