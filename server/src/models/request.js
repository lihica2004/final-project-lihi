const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    }, 
    explanation: {
        type: String,
        required: true, 
        validate(value) {
            if (value.trim().length < 1) {
                throw new Error('You must write an explanation')
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String, 
        default: 'הבקשה פתוחה'
    }, 
    declineExplanation: {
        type: String,
    }, 
}, {

    timestamps: true
}
)

const Request = mongoose.model('Request', requestSchema)

module.exports = Request;
