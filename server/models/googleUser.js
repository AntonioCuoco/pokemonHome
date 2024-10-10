const mongoose = require('mongoose');
const {Schema} = mongoose;

const GoogleUserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
    surname: {
        type: String,
    },
    email: {
		type: String,
		required: true,
        unique: true
	},
	photo: {
		type: String
	},
	userKey: {
		type: String,
		required: true,
		unique: true
	},
	isOnline: {
		type: Boolean
	}
});

const GoogleUserModel = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUserModel;