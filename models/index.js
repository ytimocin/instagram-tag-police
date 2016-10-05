'use strict';

var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var basename = path.basename(module.filename);
var config = require('konphyg')(__dirname + '/../config').all().main;

var db = {};

console.log(JSON.stringify(config.mysql));

var sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    config.mysql
);

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
