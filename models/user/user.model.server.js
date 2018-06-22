var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    return userModel.create(user);
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password})
        .exec()
        .then(function (user) {
            return user;
        })
}

function findUserByUsername(username) {
    return userModel.findOne({username: username})
        .exec()
        .then(function (user) {
            return user;
        })
}

function updateUser(userId,user) {
    return userModel.findByIdAndUpdate(userId,user,{new:true})
            .exec()
            .then(function(updatedUser){
                return updatedUser;
            });
}

function findAllUsers() {
    return userModel.find();
}

function addToFollowers(userId, fuserId, fuserName) {
    return userModel.findById(userId)
        .then(function (user) {
            var isPresent = false;
            for(var index=0;index<user.followers.length;index++) {
                if(user.followers[index].userId === fuserId) {
                    isPresent = true;
                }
            }
            if(!isPresent) {
                var follower = {userId: fuserId, username: fuserName};
                user.followers.push(follower);
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

function addToFollowing(userId, fuserId, fuserName) {
    return userModel.findById(userId)
        .then(function (user) {
            var isPresent = false;
            for(var index=0;index<user.following.length;index++) {
                if(user.following[index].userId === fuserId) {
                    isPresent = true;
                }
            }
            if(!isPresent) {
                var following = {userId: fuserId, username: fuserName};
                user.following.push(following);
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

function removeFromFollowers(userId, fuserId) {
    return userModel.findById(userId)
        .then(function (user) {
            for(var index=0;index<user.followers.length;index++) {
                if(user.followers[index].userId === fuserId) {
                    user.followers.splice(index,1);
                }
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

function removeFromFollowing(userId, fuserId) {
    return userModel.findById(userId)
        .then(function (user) {
            for(var index=0;index<user.following.length;index++) {
                if(user.following[index].userId === fuserId) {
                    user.following.splice(index,1);
                }
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    updateUser: updateUser,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername,
    addToFollowers: addToFollowers,
    addToFollowing: addToFollowing,
    removeFromFollowers: removeFromFollowers,
    removeFromFollowing: removeFromFollowing
};

module.exports = api;