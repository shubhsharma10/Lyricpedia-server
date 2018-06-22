module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/user', createUser);
    app.get('/api/profile', profile);
    app.put('/api/profile', updateProfile);
    app.post('/api/login', login);
    app.post('/api/logout',logout);
    app.get('/api/session',session);
    app.post('/api/user/follow', follow);
    app.post('/api/user/unfollow', unfollow);

    var userModel = require('../models/user/user.model.server');

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function findUserByUsername(req,res) {
        var username = req.query.username;
        userModel.findUserByUsername(username)
            .then(function(user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function session(req,res) {
        if(req.session['currentUser']) {
            res.sendStatus(200);
        } else {
            res.sendStatus(204);
        }
    }

    function profile(req, res) {
        res.send(req.session['currentUser']);
    }

    function updateProfile(req,res) {
        var userId = req.session['currentUser']._id;
        var newUser = req.body;

        userModel.updateUser(userId,newUser)
            .then(function (user) {
                req.session['currentUser'] = user;
                res.json(user);
            })
            .catch(function(error){
                res.sendStatus(500).send(error);
            });
    }

    function createUser(req, res) {
        var user = req.body;
        userModel.findUserByUsername(user.username)
            .then(function (result) {
                if(result){
                    console.log('Username already exists');
                    res.sendStatus(422);
                }
                else{
                    console.log('user not found');
                    return userModel.createUser(user);
                }
            })
            .then(function(user) {
                if(user) {
                    req.session['currentUser'] = user;
                    res.send(user);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function follow(req,res) {
        var currentUser = req.session['currentUser'];
        if(currentUser) {  // gf implies getting followed(Add to FI)  fb implies followed by(add to
            const gfUserId = req.body.fuserId;
            const gfUserName = req.body.fuserName;
            const fbUserName = currentUser.username;
            const fbUserId = currentUser._id;
            userModel.addToFollowers(gfUserId,fbUserId,fbUserName)
                .then(function(result) {
                    if(result) {
                       return userModel.addToFollowing(fbUserId,gfUserId,gfUserName);
                    }
                })
                .then(function (updatedCurrentUser) {
                    console.log(updatedCurrentUser);
                    req.session['currentUser'] = updatedCurrentUser;
                    res.sendStatus(200);
                })
                .catch(function (error) {
                    res.sendStatus(500).send(error);
                })
        } else {
            res.sendStatus(500);
        }
    }

    function unfollow(req,res) {
        var currentUser = req.session['currentUser'];
        if(currentUser) {  // gf implies getting followed(Add to FI)  fb implies followed by(add to
            const gfUserId = req.body.fuserId;
            const gfUserName = req.body.fuserName;
            const fbUserName = currentUser.username;
            const fbUserId = currentUser._id;
            userModel.removeFromFollowers(gfUserId,fbUserId,fbUserName)
                .then(function(result) {
                    if(result) {
                        return userModel.removeFromFollowing(fbUserId,gfUserId,gfUserName);
                    }
                })
                .then(function (updatedCurrentUser) {
                    console.log(updatedCurrentUser);
                    req.session['currentUser'] = updatedCurrentUser;
                    res.sendStatus(200);
                })
                .catch(function (error) {
                    res.sendStatus(500).send(error);
                })
        } else {
            res.sendStatus(500);
        }
    }

    function login(req,res){
        var username = req.body.username;
        var password = req.body.password;
        userModel.findUserByCredentials(username,password)
            .then(function(user) {
                if(user) {
                    req.session['currentUser'] = user;
                    res.json(user);
                } else {
                    res.sendStatus(401);
                }
            })
            .catch(function(error){
                console.log(error);
            })
    }

    function logout(req,res) {
        req.session.destroy();
        res.sendStatus(200);
    }
};