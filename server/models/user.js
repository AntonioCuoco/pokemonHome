const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
		type: String,
		required: true,
        unique: true
	},
	password: {
		type: String,
		required: true
	},
	userKey: {
		type: String,
		required: true,
		unique: true
	},
	photoUrl: {
		type: String,
		unique: true
	},
	isOnline: {
		type: Boolean
	}
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;