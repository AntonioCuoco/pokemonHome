const mongoose = require('mongoose');

const pastTournamentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    data: {
        type: Array,
        required: [true, "Please enter data"]
    },
    
},
)

const PastTournament = mongoose.model("pastTournament", pastTournamentSchema, "pastTournament"); 

module.exports = PastTournament;