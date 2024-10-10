const mongoose = require('mongoose');
const {Schema} = mongoose;

const PokemonTeamSchema = new Schema({
	nameTeam: {
		type: String,
		required: false,
		unique: true
	},
	nameUser: {
		type: String,
		required: true
	},
    teamArray: {
		type: Array,
		required: true
	}
});

const PokemonTeamModel = mongoose.model('pokemonTeam', PokemonTeamSchema);

module.exports = PokemonTeamModel;