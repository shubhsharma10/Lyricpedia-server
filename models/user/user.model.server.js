var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserById(userId) {
    return userModel.findById(userId);
}

function findUserByUsernameFNOrLN(query) {
    return userModel.find({'$or': [
                                {'username':{'$regex':query,  '$options':'i'}},
                                {'firstName':{'$regex':query, '$options':'i'}},
                                {'lastName':{'$regex':query,  '$options':'i'}}
                                ]})
        .exec()
        .then(function (users) {
            return users;
        })
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

function deleteUser(userId) {
    return findUserById(userId)
        .then(function (user) {
            return user.remove();
        })
}

function findAllUsers() {
    return userModel.find();
}

function findUsernames(listOfUserIds) {
    return Promise.all(
        listOfUserIds.map(function (userId) {
            return userModel.findById(userId);
        }));
}

function addToFollowers(userId, fuserId) {
    return userModel.findById(userId)
        .then(function (user) {
            var isPresent = false;
            for(var index=0;index<user.followers.length;index++) {
                if(user.followers[index].userId === fuserId) {
                    isPresent = true;
                }
            }
            if(!isPresent) {
                var follower = {userId: fuserId};
                user.followers.push(follower);
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

function addToFollowing(userId, fuserId) {
    return userModel.findById(userId)
        .then(function (user) {
            var isPresent = false;
            for(var index=0;index<user.following.length;index++) {
                if(user.following[index].userId === fuserId) {
                    isPresent = true;
                }
            }
            if(!isPresent) {
                var following = {userId: fuserId};
                user.following.push(following);
            }
            return userModel.findByIdAndUpdate(userId,user,{new:true})
                .exec()
                .then(function(updatedUser) {
                    return updatedUser;
                })
        })
}

function removeUserFromFollowersAndFollowing(userId) {
    return userModel.find({'$or': [
                                {followers: {$elemMatch: {userId: userId}}},
                                {following: {$elemMatch: {userId: userId}}}
                            ]})
        .then(function(users) {
            for(var i = 0; i < users.length; i++){
                const userFRIndex = users[i].followers
                                            .map(function (x) { return x.userId.toString(); })
                                            .indexOf(userId);
                if(userFRIndex > -1){
                    console.log('found index, now splicing it');
                    users[i].followers.splice(userFRIndex,1);
                }
                const userFIIndex = users[i].following
                    .map(function (x) { return x.userId.toString(); })
                    .indexOf(userId);
                if(userFIIndex > -1){
                    console.log('found index, now splicing it');
                    users[i].following.splice(userFIIndex,1);
                }
            }
            return Promise.all(
                users.map(function (updatedUser) {
                    return userModel.findByIdAndUpdate(updatedUser._id,updatedUser,{new:true});
                })
            )
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
    deleteUser: deleteUser,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername,
    addToFollowers: addToFollowers,
    addToFollowing: addToFollowing,
    removeFromFollowers: removeFromFollowers,
    removeFromFollowing: removeFromFollowing,
    findUserByUsernameFNOrLN: findUserByUsernameFNOrLN,
    removeUserFromFollowersAndFollowing: removeUserFromFollowersAndFollowing,
    findUsernames: findUsernames
};

module.exports = api;