var mongoose = require('mongoose');
var songSchema = require('./song.schema.server');
var songModel = mongoose.model('SongModel', songSchema);

function findSongById(songId) {
    console.log(typeof songId);
    return songModel.findOne({track_id: songId})
        .exec()
        .then(function (song) {
            return song;
        })
}

function createSong(song) {
    return songModel.create(song);
}

function deleteSong(songId) {
    return findSongById(songId)
        .then(function (song) {
            return song.remove();
        })
}

function findAllSongs() {
    return songModel.find();
}

function findSongsForUser(userId) {
    return songModel.find({ listOfUsers: {
        $elemMatch: {userId: userId}
    }});
}

function updateTranslation(songId,userId,username,transalation) {
    return findSongById(songId)
            .then(function(song) {
                var userExists = false;
                const existingUsers = song.lot;
                for(var x = 0;x < existingUsers.length ; x++) {
                    var userEntry = existingUsers[x];
                    if(userEntry.userId === userId) {
                        userExists = true;
                    }
                }

                if(!userExists) {
                    song.lot.push({userId: userId, username: username});
                }
                song.translation = transalation;
                return songModel.findByIdAndUpdate(song._id,song,{new:true})
                    .exec()
                    .then(function(updatedSong) {
                        return updatedSong;
                    })
            })
            .then(function (updatedSong) {
                return updatedSong;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            })
}

function updateSong(songId,incomingUserId,incomingUsername,rating) {
    return findSongById(songId)
        .then(function(song) {
            var userExists = false;
            console.log('incomingRating: '+rating);
            const users = song.listOfUsers;
            for(var x = 0;x < song.listOfUsers.length ; x++) {
                var user = song.listOfUsers[x];
                if(user.userId.toString() === incomingUserId) {
                    userExists = true;
                    const existingRating = user.rating;
                    console.log('existingRating: '+existingRating);
                    //console.log('incomingRating: '+rating);
                    if(existingRating !== rating) {
                        if(rating === 'like') {
                            song.likes += 1;
                            song.dislikes -= 1;
                            song.listOfUsers[x].rating = 'like';
                        } else {
                            song.likes -= 1;
                            song.dislikes += 1;
                            song.listOfUsers[x].rating = 'dislike';
                        }
                    }
                }
            }
            console.log('user found in list '+userExists);
            if(!userExists) {
                if (rating === 'like'){
                    song.likes += 1;
                    song.listOfUsers.push({userId : incomingUserId,
                        username: incomingUsername,
                        rating : rating});
                }else{
                    song.dislikes += 1;
                    song.listOfUsers.push({userId : incomingUserId,
                        username: incomingUsername,
                        rating : rating});
                }
            }
            return songModel.findByIdAndUpdate(song._id,song,{new:true})
                .exec()
                .then(function(updatedSong) {
                    return updatedSong;
                })
        })
        .then(function (updatedSong) {
            return updatedSong;
        })
        .catch(function (error) {
            console.log(error);
            return error;
        })


}

var api = {
    createSong: createSong,
    findAllSongs: findAllSongs,
    findSongById: findSongById,
    updateSong: updateSong,
    findSongsForUser: findSongsForUser,
    deleteSong: deleteSong,
    updateTranslation: updateTranslation
};

module.exports = api;