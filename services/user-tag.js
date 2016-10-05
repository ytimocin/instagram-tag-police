var models = require('../models');
var lodash = require('lodash');
var config = require('konphyg')(__dirname + '/../config').all().main;
var async = require('async');


export function createUserTag(userTag) {
    return new Promise(function (resolve, reject) {
        findByTagName(userTag.tagName.toString().trim(), {eagerLoad: true}, function (err, data) {
            if (err) {
                reject('createUserTag.findByTagName.err: ' + JSON.stringify(err.message));
            }

            if (data) {
                resolve(data);
            } else {
                models.UserTag.create(userTag, {}).then(function (userTagDB) {
                    resolve(userTagDB.get({plain: true}));
                }).catch(function (err) {
                    reject('createUserTag.findByTagName.create.err: ' + JSON.stringify(err.message));
                });
            }
        });
    });
}

export function findByTagName(tagName, options, callback) {
    if (!tagName) {
        var err = new Error("Invalid tagName: " + tagName);
        err.code = 400;
        return callback(err, null);
    }
    findOne({tagName: tagName}, options, callback);
}

export function findByUserId(userId) {
    return new Promise(function (resolve, reject) {
        models.UserTag.findAll({
            where: {
                instagramUserId: userId
            }
        }).then(function (userTags) {
            resolve(userTags);
        }).catch(function (err) {
            reject('findByUserId.err: ' + JSON.stringify(err.message));
        });
    });
}

function findOne(where, options, callback) {
    if (options && options.eagerLoad) {
        models.UserTag.findOne({
            where: where,
            include: []
        }).then(function (userTagDB) {

            if (userTagDB) {
                callback(null, userTagDB.get({plain: true}));
            } else {
                callback(null, null);
            }

        }).catch(function (err) {
            callback(err, null);
        });
    } else {
        models.UserTag.findOne({
            where: where
        }).then(function (userTagDB) {

            if (userTagDB) {
                callback(null, userTagDB.get({plain: true}));
            } else {
                callback(null, null);
            }

        }).catch(function (err) {
            callback(err, null);
        });
    }
}
