const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: { 
        type: String, 
        required: true 
    },
    createAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 43200 
    }
});

module.exports = mongoose.model('Token', TokenSchema);