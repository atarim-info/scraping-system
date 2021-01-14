const mongoose = require('mongoose');

const webPageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    page: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

const WebPageRecord = mongoose.model('webPage', webPageSchema)



module.exports = { WebPageRecord };