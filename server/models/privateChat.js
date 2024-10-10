const mongoose = require('mongoose');
const {Schema} = mongoose;

const privateChatSchema = new Schema({
    userKey: {
        type: Array,
        required: [true,"userKey is required"]
    },
    chatMessage: {
        type: Array,
        required: [true, "chatMessage is required"]
    },
    chatName: {
        type: String,
        required: [true, "chatName is required"],
        unique: true
    }
},
{
    timestamps: true
}
)

const PrivateChat = mongoose.model("privateChat", privateChatSchema,"privateChat");

module.exports = PrivateChat;