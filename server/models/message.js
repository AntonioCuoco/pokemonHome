const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: [true, "Please enter message"]
    },
    username: {
        type: String,
        required: [true, "Please enter username"]
    },
    room: {
        type: String,
        required: [true, "Please enter room name"]
    },
    __createdtime__: {
        type: String,
        required: [true, "Please insert creation date time"],
    }
},
{
    timestamps: true
}
)

const Message = mongoose.model("message", messageSchema,"message"); 

module.exports = Message;