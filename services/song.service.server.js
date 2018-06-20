module.exports = function (app) {
    app.get('/api/song', findAllSongs);
    app.get('/api/song/:songId', findSongById);
    app.post('/api/song', createSong);
    app.put('/api/song/:songId',updateSong);
    app.get('/api/user/song',findSongsForUser);
    

    var songModel = require('../models/song/song.model.server');
    var mongoose = require('mongoose');
    function findSongById(req, res) {
        var id = req.params['songId'];
        songModel.findSongById(id)
            .then(function (song) {
                if(song) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(204)
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
                        songEntry.push({track_id: songs[i].track_id, rating: rating });
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
        var userId = req.session['currentUser']._id;
        var rating = req.body['rating'];
        console.log("Stripped "+rating);
        var songId = req.params['songId'];

        songModel
            .updateSong(songId, userId, rating)
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