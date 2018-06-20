var mongoose = require('mongoose');
var songSchema = require('./song.schema.server');
var songModel = mongoose.model('SongModel', songSchema);

function findSongById(songId) {
    return songModel.findOne({track_id: songId})
        .then(function (song) {
            return song;
        })
}

function createSong(song) {
    return songModel.create(song);
}

function findAllSongs() {
    return songModel.find();
}

function findSongsForUser(userId) {
    return songModel.find({ listOfUsers: {
        $elemMatch: {userId: userId}
    }});
}

function updateSong(songId,incomingUserId,rating) {
    return findSongById(songId)
        .then(function(song) {
            var userExists = false;
            const users = song.listOfUsers;
            for(var x = 0;x < song.listOfUsers.length ; x++) {
                var user = song.listOfUsers[x];
                if(user.userId.toString() === incomingUserId) {
                    userExists = true;
                    const existingRating = user.rating;
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
                    song.listOfUsers.push({userId : incomingUserId, rating : rating});
                }else{
                    song.dislikes += 1;
                    song.listOfUsers.push({userId : incomingUserId, rating : rating});
                }
            }
            return songModel.findByIdAndUpdate(song._id,song,{new:true})
                .exec()
                .then(function(updatedSong) {
                    return updatedSong;
                })
        })
        .then(function (updatedSong) {
            console.log(updatedSong);
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
    findSongsForUser: findSongsForUser
};

module.exports = api;