'use strict';
module.exports = function (sequelize, DataTypes) {
    var UserTag = sequelize.define('UserTag', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            field: 'id',
            primaryKey: true
        },

        instagramUserId: {
            type: DataTypes.STRING,
            field: 'instagram_user_id'
        },

        tagName: {
            type: DataTypes.STRING,
            field: 'tag_name'
        },

        lastChecked: {
            type: DataTypes.DATE,
            field: 'last_checked'
        },

        smsNotification: {
            type: DataTypes.BOOLEAN,
            field: 'sms_notification'
        },

        emailNotification: {
            type: DataTypes.BOOLEAN,
            field: 'email_notification'
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
        tableName: 'user_tag',

        classMethods: {

            associate: function (models) {

                UserTag.belongsTo(models.InstagramUser, {
                    as: 'instagramUser',
                    foreignKey: 'instagram_user_id'
                });

            }
        }

    });
    return UserTag;
};
