const mongoose = require('mongoose')

const playersSchema = mongoose.Schema({
    name: String,
    level: String
})

module.exports = mongoose.model('Player', playersSchema)

