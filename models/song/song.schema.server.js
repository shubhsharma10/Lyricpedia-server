var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
    track_id: Number,
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    listOfUsers: [{userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}, rating: String}]
}, {collection: 'songs'});

module.exports = songSchema;