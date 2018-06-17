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

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    updateUser: updateUser,
    findUserByCredentials: findUserByCredentials,
    findUserByUsername: findUserByUsername
};

module.exports = api;