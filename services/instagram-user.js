var models = require('../models');
var lodash = require('lodash');
var config = require('konphyg')(__dirname + '/../config').all().main;
var async = require('async');


export function createOrUpdateInstagramUser(instagramUser) {

    return new Promise(function (resolve, reject) {

        findByInstagramId(instagramUser.instagramId, {eagerLoad: true}, async function (err, data) {

            if (err) {
                reject('createInstagramUser.findByInstagramId.err: ' + JSON.stringify(err.message));
            }

            if (data) {
                const instagramUserUpdate = await updateInstagramUser(instagramUser);
                resolve(instagramUserUpdate);
            } else {
                models.InstagramUser.create(instagramUser, {}).then(function (instagramUserDB) {
                    resolve(instagramUserDB.get({plain: true}));
                }).catch(function (err) {
                    reject('createInstagramUser.findByInstagramId.create.err: ' + JSON.stringify(err.message));
                });
            }

        });

    });

}

export function getInstagramUserViaAccessToken(accessToken) {

    return new Promise(function (resolve, reject) {

        console.log("getInstagramUserViaAccessToken");

        findByAccessToken(accessToken, {eagerLoad: true}, function (err, data) {

            if (err) {
                resolve(null);
            }

            if (data) {
                resolve(data);
            } else {
                resolve(null);
            }

        });

    });

}

export function findByAccessToken(accessToken, options, callback) {

    if (!accessToken) {
        var err = new Error("Invalid accessToken: " + accessToken);
        err.code = 400;
        return callback(err, null);
    }
    findOne({accessToken: accessToken}, options, callback);

}

export function findByInstagramId(instagramId, options, callback) {

    if (!instagramId) {
        var err = new Error("Invalid instagramId: " + instagramId);
        err.code = 400;
        return callback(err, null);
    }
    findOne({instagramId: instagramId}, options, callback);

}

function findOne(where, options, callback) {

    if (options && options.eagerLoad) {
        models.InstagramUser.findOne({
            where: where,
            include: []
        }).then(function (instagramUserDB) {

            if (instagramUserDB) {
                callback(null, instagramUserDB.get({plain: true}));
            } else {
                callback(null, null);
            }

        }).catch(function (err) {
            callback(err, null);
        });
    } else {
        models.InstagramUser.findOne({
            where: where
        }).then(function (instagramUserDB) {

            if (instagramUserDB) {
                callback(null, instagramUserDB.get({plain: true}));
            } else {
                callback(null, null);
            }

        }).catch(function (err) {
            callback(err, null);
        });
    }

}

export function updateInstagramUser(instagramUser) {

    return new Promise(function (resolve, reject) {

        findByInstagramId(instagramUser.instagramId, {"eagerLoad": true}, function (err, instagramUserDB) {

            if (err) {
                reject('updateInstagramUser.findByInstagramId.err: ' + JSON.stringify(err.message));
            }

            var promises = [];
            promises.push(models.InstagramUser.update(instagramUser, {where: {instagramId: instagramUserDB.instagramId}}));

            Promise.all(
                promises
            ).then(function (updatedInstagramUser) {
                // update success
                // todo return updated object
                resolve(instagramUser);
            }).catch(function (err) {
                reject(err);
            });

        });

    });

}
