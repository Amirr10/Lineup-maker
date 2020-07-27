const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')

const Player = require('./model/playersSchema')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI || process.env.MONGOOSE_URL, { useNewUrlParser: true })
        .then(() => console.log("Mongoose"));


//return list of players from db
app.get('/', (req, res) => {
    
    let p = Player.find( (err, doc) => {
        res.json(doc)
    })

    res.json();
})


//insert player to db
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


app.listen(PORT, () => console.log("Connected"));