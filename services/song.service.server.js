module.exports = function (app) {
    app.get('/api/song', findAllSongs);
    app.get('/api/song/:songId', findSongById);
    app.post('/api/song', createSong);
    app.put('/api/song/:songId',updateSong);
    app.get('/api/user/song',findSongsForUser);
    app.delete('/api/song/:songId',deleteSong);
    

    var songModel = require('../models/song/song.model.server');
    var playlistModel = require('../models/playlist/playlist.model.server');
    var mongoose = require('mongoose');
    function findSongById(req, res) {
        var id = req.params['songId'];
        songModel.findSongById(id)
            .then(function (song) {
                if(song) {
                    res.send(song)
                } else {
                    res.send(204)
                }
            })
    }

    function createSong(req, res) {
        var song = req.body;
        songModel.createSong(song)
            .then(function(song) {
                if(song) {
                    res.send(song);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function deleteSong(req,res) {
        var trackId = req.params['songId'];
        playlistModel
            .removeSongFromAllPlaylists(trackId)
            .then(function(result) {
                if(result) {
                    return songModel.deleteSong(trackId);
                }
                throw new Error('Cancel enrollments for all failed');
            })
            .then(function () {
                res.sendStatus(200);
            })
            .catch(function(error){
                res.sendStatus(500).send(error);
            });
    }

    function findAllSongs(req,res) {
        songModel.findAllSongs()
            .then(function (songs) {
                res.send(songs);
            })

    }
    function findSongsForUser(req,res) {
        var currentUser = req.session['currentUser'];
        if(currentUser) {
            var userId = currentUser._id;
            songModel.findSongsForUser(userId)
                .then(function (songs) {
                    var songEntry = [];
                    for(var i = 0;i< songs.length;i++) {
                        var lou = songs[i].listOfUsers;
                        var rating = '';
                        for(var j=0;j<lou.length;j++) {
                            if(lou[j].userId.toString() === userId){
                                rating = lou[j].rating;
                            }
                        }
                        console.log(rating);
                        songEntry.push({track_id: songs[i].track_id,
                            track_name: songs[i].track_name,
                            likes: songs[i].likes,
                            dislikes: songs[i].dislikes,
                            rating: rating });
                    }
                    console.log(songEntry);
                    res.json(songEntry)
                })
                .catch(function (error) {
                    res.send(error);
                });
        } else {
            res.sendStatus(500);
        }
    }
    function updateSong(req, res){
        var currentUser = req.session['currentUser'];
        var rating = req.body['rating'];
        console.log("Stripped "+rating);
        var songId = req.params['songId'];

        songModel
            .updateSong(songId, currentUser._id, currentUser.username, rating)
            .then(function (song) {
                if (song) {
                    console.log("Checking return at server "+song);
                    res.json(song);
                }else{
                    res.sendStatus(404);
                }
            });
    }
};