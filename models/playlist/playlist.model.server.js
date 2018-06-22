var mongoose = require('mongoose');
var playlistSchema = require('./playlist.schema.server');
var playlistModel = mongoose.model('PlaylistModel', playlistSchema);

function findPlaylistByName(playlistName) {
    return playlistModel.findOne({name: playlistName})
        .then(function (playlist) {
            return playlist;
        })
}

function findPlaylistById(playlistId) {
    return playlistModel.findById(playlistId)
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

function deletePlaylist(playlistId) {
    return playlistModel.findById(playlistId)
        .exec()
        .then(function (playlist) {
            return playlist.remove();
        });
}

function renamePlaylist(playlistId,newName) {
    return playlistModel.findByIdAndUpdate(playlistId,
        {$set:
            { name : newName }
        })
        .exec()
        .then(function(updatedPlaylist){
            return updatedPlaylist;
        });
}

function removeSongFromPlaylist(playlistId,trackId) {
    return playlistModel.findById(playlistId)
        .then(function(playlist) {
            var existingSongs = playlist.tracks;
            var songIndex = -1;
            for(var i=0;i<existingSongs.length;i++) {
                if(existingSongs[i].track_id === trackId) {
                    songIndex = i;
                }
            }
            if(songIndex > -1) {
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

function removeSongFromAllPlaylists(trackId) {
    return playlistModel.find({tracks: {$elemMatch: {track_id: trackId}}})
        .exec()
        .then(function(playlists) {
            for(var i=0;i<playlists.length;i++) {
                var playlist = playlists[i];
                var existingSongs = playlist.tracks;
                var songIndex = -1;
                for(var j=0;j<existingSongs.length;j++) {
                    if(existingSongs[j].track_id.toString() === trackId) {
                        songIndex = j;
                    }
                }
                if(songIndex > -1) {
                    playlist.tracks.splice(songIndex,1);
                }
            }

            return Promise.all(
                playlists.map(function (newPlaylist) {
                    var playlistId = newPlaylist._id;
                    return playlistModel.findByIdAndUpdate(playlistId,newPlaylist,{new:true});
                })
            )
        })
        .then(function (updatedPlayLists) {
            console.log(updatedPlayLists);
            return updatedPlayLists;
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
    findPlaylistById: findPlaylistById,
    findPlaylistsForUser: findPlaylistsForUser,
    addToPlaylist: addToPlaylist,
    removeFromPlaylist: removeFromPlaylist,
    removeSongFromPlaylist: removeSongFromPlaylist,
    renamePlaylist: renamePlaylist,
    deletePlayList: deletePlaylist,
    removeSongFromAllPlaylists: removeSongFromAllPlaylists
};

module.exports = api;