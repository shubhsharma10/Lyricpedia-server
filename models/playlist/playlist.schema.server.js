var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
    userId: String,
    name: String,
    tracks: [{track_id: Number, track_name: String}]
}, {collection: 'playlists'});

module.exports = playlistSchema;