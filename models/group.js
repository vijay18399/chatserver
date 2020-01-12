var mongoose = require('mongoose');
var GroupSchema = new mongoose.Schema({
groupid: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
owner: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
 
});
 
 
module.exports = mongoose.model('Group', GroupSchema);