var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
    track_id: Number,
    track_name: String,
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    translation: String,
    listOfUsers: [{
                    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
                    username: String,
                    rating: String
                    }],
    lot: [{
        userId: String,
        username: String }]
}, {collection: 'songs'});

module.exports = songSchema;