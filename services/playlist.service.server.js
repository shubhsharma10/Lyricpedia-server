module.exports = function (app) {
    app.get('/api/playlist', findAllPlaylists);
    app.get('/api/playlist/:playlistName', findPlaylistByName);
    app.post('/api/playlist', createPlaylist);
    app.get('/api/user/playlist', findPlaylistsForUser);
    app.put('/api/playlist/add',addToPlaylist);
    app.put('/api/playlist/remove',removeFromPlaylist);
    app.delete('/api/playlist/:playlistId',deletePlaylist);

    var playlistModel = require('../models/playlist/playlist.model.server');

    function findPlaylistByName(req, res) {
        var playlistName = req.params['playlistName'];
        playlistModel.findPlaylistByName(playlistName)
            .then(function (playlist) {
                if(playlist) {
                    res.send(playlist)
                } else {
                    res.sendStatus(204)
                }
            })
    }

    function deletePlaylist(req,res) {
        var playlistId = req.params['playlistId'];
        if (playlistId) {
            playlistModel.deletePlayList(playlistId)
                .then(function () {
                    res.sendStatus(200);
                })
                .catch(function (error) {
                    res.sendStatus(500).send(error);
                });
        } else {
            res.sendStatus(500);
        }
    }

    function createPlaylist(req, res) {
        var playlist = req.body;
        const user = req.session['currentUser'];
        playlist.userId = user._id;
        playlistModel.createPlaylist(playlist)
            .then(function(playlist) {
                if(playlist) {
                    res.send(playlist);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function findAllPlaylists(req,res) {
        playlistModel.findAllPlaylists()
            .then(function (playlists) {
                res.send(playlists);
            })

    }

    function findPlaylistsForUser(req,res) {
        if(req.session['currentUser']) {
            const user = req.session['currentUser'];
            const userId = user._id;
            playlistModel.findPlaylistsForUser(userId)
                .then(function (playlists) {
                    res.send(playlists);
                })
        } else {
            res.sendStatus(500);
        }
    }

    function addToPlaylist(req, res){
        if(req.session['currentUser']) {
            var userId = req.session['currentUser']._id;
            var trackId = req.body['trackId'];
            var playListName = req.body['playlistName'];
            var trackName = req.body['trackName'];
            console.log("Stripped " + trackId + ' ' + trackName + ' playlistName: ' + playListName);
            playlistModel.addToPlaylist(userId, playListName, trackId, trackName)
                .then(function (updatedPlaylist) {
                    res.send(updatedPlaylist);
                })
                .catch(function (error) {
                    console.log(error);
                    res.sendStatus(204);
                })
        } else {
            req.sendStatus(500);
        }
    }

    function removeFromPlaylist(req, res){
        if(req.session['currentUser']) {
            var userId = req.session['currentUser']._id;
            var trackId = req.body['trackId'];
            var playListName = req.body['playlistName'];
            console.log("Stripped " + trackId + ' playlistName: ' + playListName);
            playlistModel.removeFromPlaylist(userId, playListName, trackId)
                .then(function (updatedPlaylist) {
                    res.send(updatedPlaylist);
                })
                .catch(function (error) {
                    console.log(error);
                    res.sendStatus(204);
                })
        } else {
            req.sendStatus(500);
        }
    }
};