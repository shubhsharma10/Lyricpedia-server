var mongoose = require('mongoose');
var playlistSchema = require('./playlist.schema.server');
var playlistModel = mongoose.model('PlaylistModel', playlistSchema);

function findPlaylistByName(playlistName) {
    return playlistModel.findOne({name: playlistName})
        .then(function (playlist) {
            return playlist;
        })
}

function findPlaylistByNameAndUserId(playlistName, userId) {
    return playlistModel.findOne({name: playlistName, userId: userId})
        .then(function (playlist) {
            return playlist;
        })
}

function createPlaylist(playlist) {
    return playlistModel.create(playlist);
}

function findAllPlaylists() {
    return playlistModel.find();
}

function findPlaylistsForUser(userId) {
    return playlistModel.find({ userId: userId});
}

function addToPlaylist(userId, playlistName,trackId,trackName) {
    return findPlaylistByNameAndUserId(playlistName, userId)
        .then(function(playlist) {
            var existingSongs = playlist.tracks;
            var songIsAlreadyIn = false;
            for(var i=0;i<existingSongs.length;i++) {
                if(existingSongs[i].track_id === trackId) {
                    songIsAlreadyIn = true;
                }
            }
            if(!songIsAlreadyIn) {
                playlist.tracks.push({track_id: trackId, track_name: trackName});
            }
            return playlistModel.findByIdAndUpdate(playlist._id,playlist,{new:true})
                .exec()
                .then(function(updatedPlayList) {
                    return updatedPlayList;
                });
        })
        .then(function (updatedPlayList) {
            console.log(updatedPlayList);
            return updatedPlayList;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        })
}

function deletePlaylist(playlistName) {
    return findPlaylistByName(playlistName)
        .then(function (playlist) {
            return playlist.remove();
        })
}

function removeFromPlaylist(userId, playlistName,trackId) {
    return findPlaylistByNameAndUserId(userId, playlistName)
        .then(function(playlist) {
            var existingSongs = playlist.tracks;
            var songIndex = -1;
            for(var i=0;i<existingSongs.length;i++) {
                if(existingSongs[i].track_id === trackId) {
                    songIndex = i;
                }
            }
            if(songIndex > 0) {
                playlist.tracks.splice(songIndex,1);
            }
            return playlistModel.findByIdAndUpdate(playlist._id,playlist,{new:true})
                .exec()
                .then(function(updatedPlayList) {
                    return updatedPlayList;
                });
        })
        .then(function (updatedPlayList) {
            console.log(updatedPlayList);
            return updatedPlayList;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        })


}

var api = {
    createPlaylist: createPlaylist,
    findAllPlaylists: findAllPlaylists,
    findPlaylistByName: findPlaylistByName,
    findPlaylistsForUser: findPlaylistsForUser,
    addToPlaylist: addToPlaylist,
    removeFromPlaylist: removeFromPlaylist,
    deletePlayList: deletePlaylist
};

module.exports = api;