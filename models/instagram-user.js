'use strict';
module.exports = function (sequelize, DataTypes) {
    var InstagramUser = sequelize.define('InstagramUser', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field: 'id',
            primaryKey: true
        },

        instagramId: {
            type: DataTypes.STRING,
            field: 'instagram_id'
        },

        username: {
            type: DataTypes.STRING,
            field: 'username'
        },

        bio: {
            type: DataTypes.STRING,
            field: 'bio'
        },

        website: {
            type: DataTypes.STRING,
            field: 'website'
        },

        profilePicture: {
            type: DataTypes.STRING,
            field: 'profile_picture'
        },

        fullName: {
            type: DataTypes.STRING,
            field: 'full_name'
        },

        accessToken: {
            type: DataTypes.STRING,
            field: 'access_token'
        },

        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },

        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },

        deletedAt: {
            type: DataTypes.DATE,
            field: 'deleted_at'
        }

    }, {
        timestamps: true,
        paranoid: true,
        tableName: 'instagram_user',

        classMethods: {

            associate: function (models) {

                // todo if necessary

            }
        }

    });
    return InstagramUser;
};
