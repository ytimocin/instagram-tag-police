var express = require('express');
var router = express.Router();
var lodash = require('lodash');
var cookieParser = require('cookie-parser');
var instagramApi = require('instagram-node').instagram();
var fs = require('fs');
var Bluebird = require('bluebird');
var config = require('./config');
var async = require('async');

import {prepareInstagramUser} from '../utils/model-helper';
import {createOrUpdateInstagramUser, getInstagramUserViaAccessToken} from '../services/instagram-user';
import {createUserTag, findByUserId} from '../services/user-tag';

Bluebird.promisifyAll(instagramApi);

/* Redirect user to Instagram for authentication */
router.get('/authorize-user', function (req, res) {
    instagramApi.use({
        client_id: config.instagram_client_id,
        client_secret: config.instagram_client_secret
    });
    res.redirect(instagramApi.get_authorization_url(config.instagram_redirect_uri));
});

/* Set cookie once Instagram sends access code */
router.get('/handleauth', function (req, res) {
    instagramApi.authorize_userAsync(req.query.code, config.instagram_redirect_uri)
        .then(async function (result) {

            const instagramUser = await prepareInstagramUser(result);
            const createInstagramUserResult = await createOrUpdateInstagramUser(instagramUser);

            res.cookie('instaToken', result.access_token, {maxAge: 900000, httpOnly: true});
            res.redirect('/');
        })
        .catch(function (errors) {
            console.log(errors);
        });
});

/* Index Page */
router.get('/', async function (req, res) {

    if (req.cookies.instaToken) {

        instagramApi.use({access_token: req.cookies.instaToken});

        // todo check if the access_token is valid
        const instagramUser = await getInstagramUserViaAccessToken(req.cookies.instaToken);

        if (!instagramUser) {
            res.clearCookie('instaToken');
            res.render('index', {
                showLogin: true
            });
        }

        const userTags = await findByUserId(instagramUser.id);
        console.log("userTags: " + JSON.stringify(userTags));

        instagramApi.tag_search("photooftheday", function(err, result, remaining, limit) {
            console.log("result: " + JSON.stringify(result));
        });

        /*
        for (let tag of userTags) {
            instagramApi.tag_search(tag, function(err, result, remaining, limit) {
                console.log
            });
        }
        */

        var dataToBeRendered = {};
        dataToBeRendered.showLogin = false;
        dataToBeRendered.appId = instagramUser.id;
        dataToBeRendered.instagramId = instagramUser.instagramId;
        dataToBeRendered.username = instagramUser.username;
        dataToBeRendered.bio = instagramUser.bio;
        dataToBeRendered.website = instagramUser.website;
        dataToBeRendered.profilePicture = instagramUser.profilePicture;
        dataToBeRendered.fullName = instagramUser.fullName;
        dataToBeRendered.createdAt = instagramUser.createdAt;
        dataToBeRendered.userTags = userTags;

        res.render('index', dataToBeRendered);

    } else {
        res.render('index', {
            showLogin: true
        });
    }
});

module.exports = router;
